from typing import Optional


class LanguageConfig:    
    def __init__(
        self,
        image: str,
        file_ext: str,
        run_cmd: str,
        compile_cmd: Optional[str] = None,
        timeout: int = 10,
        memory: str = "256m",
        cpu_period: int = 100000,
        cpu_quota: int = 50000,
    ):
        self.image = image
        self.file_ext = file_ext
        self.run_cmd = run_cmd
        self.compile_cmd = compile_cmd
        self.timeout = timeout
        self.memory = memory
        self.cpu_period = cpu_period
        self.cpu_quota = cpu_quota


LANGUAGES = {
    "python": LanguageConfig(
        image="python:3.12-alpine",
        file_ext=".py",
        run_cmd="python {file}",
        compile_cmd=None,
        timeout=10,
        memory="256m",
    ),
    "javascript": LanguageConfig(
        image="node:20-alpine",
        file_ext=".js",
        run_cmd="node {file}",
        compile_cmd=None,
        timeout=10,
        memory="256m",
    ),
    "java": LanguageConfig(
        image="openjdk:17-alpine",
        file_ext=".java",
        run_cmd="java Main",
        compile_cmd="javac {file}",
        timeout=15,
        memory="512m",
    ),
}


def get_supported_languages():
    return list(LANGUAGES.keys())


def get_language_config(language: str) -> LanguageConfig:
    if language not in LANGUAGES:
        raise ValueError(
            f"Unsupported language: {language}. "
            f"Supported languages: {', '.join(get_supported_languages())}"
        )
    return LANGUAGES[language]