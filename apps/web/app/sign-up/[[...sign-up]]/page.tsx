import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden py-20">
            {/* Background Gradient Orbs */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] -z-10" />

            <div className="glass p-8 rounded-3xl z-10 shadow-[0_0_50px_rgba(59,130,246,0.1)] border-white/5">
                <SignUp
                    appearance={{
                        elements: {
                            formButtonPrimary: "bg-white text-black hover:bg-gray-200 transition-colors",
                            card: "bg-transparent shadow-none",
                            headerTitle: "text-white",
                            headerSubtitle: "text-gray-400",
                            socialButtonsBlockButton: "glass border-white/10 text-white hover:bg-white/5 transition-colors",
                            socialButtonsBlockButtonText: "text-white font-medium",
                            dividerLine: "bg-white/10",
                            dividerText: "text-gray-500",
                            formFieldLabel: "text-gray-400",
                            formFieldInput: "glass border-white/10 text-white focus:border-blue-500/50 transition-colors",
                            footerActionText: "text-gray-400",
                            footerActionLink: "text-blue-400 hover:text-blue-300 transition-colors"
                        }
                    }}
                />
            </div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none -z-10" />
        </div>
    );
}
