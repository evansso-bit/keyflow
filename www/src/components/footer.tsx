import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export default function Footer() {
    return (
        <footer className="border-t lg:mt-20 mt-10 shrink-0 grow-0 bg-background">
            <div className="container flex flex-col items-center justify-between space-y-4 py-10 md:h-24 md:flex-row md:space-y-0 md:py-0 mx-auto">
                <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built with{" "}
                        <span role="img" aria-label="love" className="inline-block animate-pulse">
                            ❤️
                        </span>{" "}
                        by the MpesaFlow team.
                    </p>
                    <p className="text-center font-medium md:text-left">
                        <span>Everybody can cook.</span>

                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <Link
                        href="https://github.com/evansso-bit/keyflow"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group transition-colors hover:text-foreground"
                    >
                        <Github className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                        <span className="sr-only">Keyflow on GitHub</span>
                    </Link>
                    <Link
                        href="https://x.com/evansso_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group transition-colors hover:text-foreground"
                    >
                        <Twitter className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                        <span className="sr-only">Keyflow on Twitter</span>
                    </Link>
                </div>
            </div>
        </footer>
    )
}