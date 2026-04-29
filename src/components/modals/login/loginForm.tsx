// src/components/modals/login/loginForm.tsx

'use client'
import { useState } from 'react';
import { Button, TextField, Label, InputGroup, Separator } from '@/components/ui/heroui';
import { toast } from 'react-toastify';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Props {
    onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: Props) {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isValid = userName.trim().length >= 2 && password.length >= 6;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!isValid) return;

        setIsLoading(true);
        try {
            const result = await signIn('credentials', {
                userName: userName.trim(),
                password,
                redirect: false,
            });

            if (result?.ok) {
                toast.success('Login successfuldt!');
                onSuccess?.();
                router.push('/account');
                router.refresh();
            } else {
                toast.error('Ugyldigt brugernavn eller kodeord');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Der skete en uventet fejl');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* ── Credentials ── */}
            <div className="flex flex-col gap-3">
                <TextField isDisabled={isLoading} isRequired fullWidth>
                    <Label>Brugernavn / email</Label>
                    <InputGroup fullWidth variant="secondary" className="border border-foreground/20 transition-colors">
                        <InputGroup.Input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Brugernavn eller email"
                            autoComplete="username"
                            className="input-autofill-fix"
                        />
                    </InputGroup>
                </TextField>

                <TextField isDisabled={isLoading} isRequired fullWidth>
                    <div className="flex items-center justify-between">
                        <Label>Adgangskode</Label>
                        <button
                            type="button"
                            disabled
                            className="text-xs text-foreground/40 cursor-not-allowed select-none"
                            tabIndex={-1}
                        >
                            Glemt adgangskode?
                        </button>
                    </div>
                    <InputGroup fullWidth variant="secondary" className="border border-foreground/20 transition-colors">
                        <InputGroup.Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            //placeholder="••••••••"
                            autoComplete="current-password"
                            className="input-autofill-fix"
                        />
                        <InputGroup.Suffix>
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="px-2 text-foreground/40 hover:text-foreground transition-colors outline-none"
                                aria-label={showPassword ? 'Skjul adgangskode' : 'Vis adgangskode'}
                            >
                                {showPassword ? <FaRegEye size={17} /> : <FaRegEyeSlash size={17} />}
                            </button>
                        </InputGroup.Suffix>
                    </InputGroup>
                </TextField>
            </div>

            {/* ── Primary action ── */}
            <Button
                type="submit"
                variant="primary"
                isPending={isLoading}
                isDisabled={!isValid || isLoading}
                className="w-full"
            >
                Log ind
            </Button>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-foreground/40 select-none">eller</span>
                <Separator className="flex-1" />
            </div>

            {/* ── Alternative logins (disabled / coming soon) ── */}
            <Button
                type="button"
                variant="ghost"
                isDisabled
                className="w-full gap-2"
            >
                <FcGoogle size={18} />
                Log ind med Google
            </Button>

            {/* ── Create account ── */}
            <p className="text-center text-xs text-foreground/50 pt-1">
                Ingen konto?{' '}
                <button
                    type="button"
                    disabled
                    className="underline underline-offset-2 text-foreground/40 cursor-not-allowed"
                >
                    Opret fri-bruger profil
                    (endnu ikke muligt)
                </button>
            </p>
        </form>
    );
}
