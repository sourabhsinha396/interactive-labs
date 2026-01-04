'use client';
import { PropsWithChildren } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

const QueryClientProvider = ({ children }: PropsWithChildren) => {
    return (
        <div>
            <ReactQueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                {children}
            </ReactQueryClientProvider>
        </div>
    )
}

export default QueryClientProvider
