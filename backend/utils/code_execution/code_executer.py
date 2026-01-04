"""
Code execution service using Docker containers.
Executes user code in isolated environments with resource limits.
"""
import time
import io
import tarfile
import docker
from typing import Dict, Any, Optional
from utils.code_execution.language_config import get_language_config, get_supported_languages


class CodeExecutor:
    """Handles code execution in Docker containers."""
    
    def __init__(self):
        try:
            self.client = docker.from_env()
            self.client.ping()  # Test Docker connection
        except Exception as e:
            raise Exception(
                f"Failed to connect to Docker. Make sure Docker is running. Error: {str(e)}"
            )
    
    def execute(self, code: str, language: str, stdin: Optional[str] = None) -> Dict[str, Any]:
        if language not in get_supported_languages():
            return {
                "stdout": "",
                "stderr": "",
                "exit_code": 1,
                "execution_time": 0,
                "error": f"Unsupported language: {language}. "
                         f"Supported: {', '.join(get_supported_languages())}"
            }
        
        config = get_language_config(language)
        
        # Compile if needed (for Java, C++, etc.)
        if config.compile_cmd:
            compile_result = self._compile(code, config)
            if compile_result["error"]:
                return compile_result
        
        # Execute the code
        return self._run(code, config, stdin)
    
    def _compile(self, code: str, config) -> Dict[str, Any]:
        try:
            start_time = time.time()            
            filename = f"Main{config.file_ext}"
            
            # Create tar archive with the code file
            tar_stream = io.BytesIO()
            tar = tarfile.TarFile(fileobj=tar_stream, mode='w')
            
            # Add code file to archive
            code_data = code.encode('utf-8')
            code_info = tarfile.TarInfo(name=filename)
            code_info.size = len(code_data)
            code_info.mtime = time.time()
            tar.addfile(code_info, io.BytesIO(code_data))
            
            tar.close()
            tar_stream.seek(0)
            
            container = self.client.containers.create(
                image=config.image,
                command="sleep 3600",
                network_mode="none",
                mem_limit=config.memory,
                cpu_period=config.cpu_period,
                cpu_quota=config.cpu_quota,
                working_dir="/workspace",
            )
            
            try:
                container.start()
                container.put_archive('/workspace', tar_stream)
                compile_cmd = config.compile_cmd.format(file=filename)
                exec_result = container.exec_run(
                    cmd=f"sh -c '{compile_cmd}'",
                    workdir="/workspace",
                    demux=True,
                )
                
                execution_time = time.time() - start_time
                
                # Parse output
                stdout_bytes, stderr_bytes = exec_result.output
                stdout = stdout_bytes.decode('utf-8') if stdout_bytes else ""
                stderr = stderr_bytes.decode('utf-8') if stderr_bytes else ""
                
                if exec_result.exit_code != 0:
                    return {
                        "stdout": stdout,
                        "stderr": stderr,
                        "exit_code": exec_result.exit_code,
                        "execution_time": round(execution_time, 3),
                        "error": "Compilation failed"
                    }
                
                return {
                    "stdout": "",
                    "stderr": "",
                    "exit_code": 0,
                    "execution_time": round(execution_time, 3),
                    "error": None
                }
                
            finally:
                # Always cleanup container
                try:
                    container.stop(timeout=1)
                except:
                    pass
                container.remove(force=True)
                
        except docker.errors.ImageNotFound:
            return {
                "stdout": "",
                "stderr": f"Docker image '{config.image}' not found",
                "exit_code": 1,
                "execution_time": 0,
                "error": "Image not found. Please pull the image first."
            }
        except docker.errors.ContainerError as e:
            return {
                "stdout": "",
                "stderr": str(e),
                "exit_code": 1,
                "execution_time": 0,
                "error": "Compilation error"
            }
        except Exception as e:
            return {
                "stdout": "",
                "stderr": str(e),
                "exit_code": 1,
                "execution_time": 0,
                "error": f"Compilation failed: {str(e)}"
            }
    
    def _run(
        self,
        code: str,
        config,
        stdin: Optional[str] = None
    ) -> Dict[str, Any]:
        """Execute code in container."""
        try:
            start_time = time.time()
            
            # Prepare filename
            filename = f"main{config.file_ext}"
            if config.file_ext == ".java":
                filename = "Main.java"
            
            # Create tar archive with the code file
            tar_stream = io.BytesIO()
            tar = tarfile.TarFile(fileobj=tar_stream, mode='w')
            
            # Add code file to archive
            code_data = code.encode('utf-8')
            code_info = tarfile.TarInfo(name=filename)
            code_info.size = len(code_data)
            code_info.mtime = time.time()
            tar.addfile(code_info, io.BytesIO(code_data))
            
            if stdin:
                stdin_data = stdin.encode('utf-8')
                stdin_info = tarfile.TarInfo(name='input.txt')
                stdin_info.size = len(stdin_data)
                stdin_info.mtime = time.time()
                tar.addfile(stdin_info, io.BytesIO(stdin_data))
            
            tar.close()
            tar_stream.seek(0)
            
            # Create container
            container = self.client.containers.create(
                image=config.image,
                command="sleep 3600",  # Keep alive temporarily
                network_mode="none",
                mem_limit=config.memory,
                cpu_period=config.cpu_period,
                cpu_quota=config.cpu_quota,
                working_dir="/workspace",
            )
            
            try:
                container.start()
                container.put_archive('/workspace', tar_stream)
                
                run_cmd = config.run_cmd.format(file=filename)
                if stdin:
                    run_cmd = f"{run_cmd} < input.txt"
                
                exec_result = container.exec_run(
                    cmd=f"sh -c '{run_cmd}'",
                    workdir="/workspace",
                    demux=True,
                )
                
                execution_time = time.time() - start_time
                
                stdout_bytes, stderr_bytes = exec_result.output
                stdout = stdout_bytes.decode('utf-8') if stdout_bytes else ""
                stderr = stderr_bytes.decode('utf-8') if stderr_bytes else ""
                
                return {
                    "stdout": stdout,
                    "stderr": stderr,
                    "exit_code": exec_result.exit_code,
                    "execution_time": round(execution_time, 3),
                    "error": None
                }
                
            finally:
                # Always cleanup container
                try:
                    container.stop(timeout=1)
                except:
                    pass
                container.remove(force=True)
                
        except docker.errors.ImageNotFound:
            return {
                "stdout": "",
                "stderr": f"Docker image '{config.image}' not found. Pulling image...",
                "exit_code": 1,
                "execution_time": 0,
                "error": "Image not found. Please try again after pulling the image."
            }
        except docker.errors.ContainerError as e:
            return {
                "stdout": "",
                "stderr": str(e),
                "exit_code": 1,
                "execution_time": 0,
                "error": "Runtime error"
            }
        except Exception as e:
            return {
                "stdout": "",
                "stderr": str(e),
                "exit_code": 1,
                "execution_time": 0,
                "error": f"Execution failed: {str(e)}"
            }
    
    def get_supported_languages(self):
        return get_supported_languages()
    
    def cleanup(self):
        """Clean up any dangling containers."""
        try:
            # Remove any stopped containers from code execution
            containers = self.client.containers.list(
                all=True,
                filters={"status": "exited"}
            )
            for container in containers:
                try:
                    container.remove()
                except:
                    pass
        except Exception as e:
            print(f"Cleanup error: {e}")