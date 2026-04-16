import Link from 'next/link';

export const HeaderLogo = () => {
    return (
        <Link href="/" className="flex items-center group">
            <div className='flex gap-x-3 items-center'>
                <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                        Private CFO
                    </span>
                    <span className="text-xs text-blue-300 font-medium">
                        Smart Money Management
                    </span>
                </div>
            </div>
        </Link>
    )
}