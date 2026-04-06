// src/components/modals/login/loginForm.tsx
'use client'
import { useState } from 'react';
import { Input, Button } from "@heroui/react";
import { toast } from 'react-toastify';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
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
                router.refresh(); // Refresh server components med ny session
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
            <Input
                label="Brugernavn/email"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                isDisabled={isLoading}
                required
                minLength={2}
            />
            <div className="relative">
                <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isDisabled={isLoading}
                    required
                    minLength={6}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute right-2 top-5 text-sm text-gray-600'
                >
                    {showPassword ? (
                        <FaRegEye size={20} />
                    ) : (
                        <FaRegEyeSlash size={20} />
                    )}
                </button>
            </div>
            <Button
                type="submit"
                color="success"
                isLoading={isLoading}
                isDisabled={!isValid || isLoading}
            >
                {isLoading ? 'Logger ind...' : 'Log ind'}
            </Button>
        </form>
    );
}