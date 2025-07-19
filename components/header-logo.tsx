import Link from 'next/link';
import Image from 'next/image';

export const HeaderLogo = () => {
    return (
        <Link href="/">
            <div className='hidden lg:flex gap-x-2 items-center'>
                <Image src={"/globe.svg"} height={20} width={20} alt="Logo" className="invert brightness-0" />
                Private CFO
            </div>
        </Link>
    )
}