import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-charcoal text-cream/60 py-12">
            <div className="container-soft">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <h4 className="font-serif font-medium text-cream mb-4">Platform</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/search" className="hover:text-cream transition-colors">Browse Listings</Link></li>
                            <li><Link href="/subscribe" className="hover:text-cream transition-colors">Pricing</Link></li>
                            <li><Link href="/login" className="hover:text-cream transition-colors">Sign In</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-serif font-medium text-cream mb-4">Host</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/listing/create" className="hover:text-cream transition-colors">List Your Property</Link></li>
                            <li><Link href="/dashboard/host" className="hover:text-cream transition-colors">Host Dashboard</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-serif font-medium text-cream mb-4">Support</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-cream transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-cream transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-cream transition-colors">FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-serif font-medium text-cream mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-cream transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-cream transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <p>&copy; {new Date().getFullYear()} Roomie. All rights reserved.</p>
                    <p>
                        built by{' '}
                        <a
                            href="https://eiteone.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cream hover:underline"
                        >
                            eiteone
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
