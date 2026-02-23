import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-svh w-full overflow-hidden">
            {/* Scenic Background */}
            <div className="hidden flex-1 bg-gradient-to-b from-cyan-300 via-purple-300 to-pink-300 lg:flex lg:items-center lg:justify-center">
                <div className="relative w-full h-full">
                    {/* Sky gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200"></div>
                    
                    {/* Flowering trees and nature elements */}
                    <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 1000 1000"
                        preserveAspectRatio="xMidYMid slice"
                    >
                        {/* Top left flowers */}
                        <circle cx="100" cy="150" r="80" fill="#d946ef" opacity="0.6" />
                        <circle cx="150" cy="120" r="70" fill="#ec4899" opacity="0.5" />
                        <circle cx="80" cy="200" r="60" fill="#f472b6" opacity="0.6" />
                        
                        {/* Top right flowers */}
                        <circle cx="850" cy="120" r="90" fill="#a855f7" opacity="0.6" />
                        <circle cx="920" cy="170" r="75" fill="#d946ef" opacity="0.5" />
                        <circle cx="900" cy="80" r="70" fill="#ec4899" opacity="0.6" />
                        
                        {/* Bridge/water element */}
                        <ellipse cx="500" cy="700" rx="250" ry="100" fill="#86efac" opacity="0.3" />
                        <path
                            d="M 350 700 Q 500 650 650 700"
                            stroke="#fbbf24"
                            strokeWidth="30"
                            fill="none"
                            opacity="0.5"
                        />
                        
                        {/* Water */}
                        <ellipse cx="500" cy="850" rx="400" ry="150" fill="#7dd3fc" opacity="0.4" />
                        
                        {/* Butterfly accents */}
                        <circle cx="300" cy="600" r="15" fill="#3b82f6" opacity="0.6" />
                        <circle cx="700" cy="550" r="15" fill="#3b82f6" opacity="0.6" />
                        <circle cx="400" cy="800" r="12" fill="#60a5fa" opacity="0.5" />
                    </svg>
                </div>
            </div>

            {/* Form Container */}
            <div className="flex w-full flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-50 p-6 lg:w-1/2 lg:bg-white">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        {/* Logo and Title */}
                        <div className="flex flex-col items-center gap-4">
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-300 to-purple-300 shadow-lg">
                                    <AppLogoIcon className="size-12 fill-current text-white" />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                                <p className="text-center text-sm text-gray-500">
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="rounded-xl bg-white p-6 shadow-lg">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
