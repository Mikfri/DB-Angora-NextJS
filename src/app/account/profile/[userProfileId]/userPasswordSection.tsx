import { useState } from "react";
import { Button, Input, Chip } from "@heroui/react";
import { FaKey, FaRegEye, FaRegEyeSlash, FaEdit } from "react-icons/fa";

interface Props {
  isChangingPassword: boolean;
  changePasswordError: string | null;
  changePasswordSuccess: boolean;
  handleChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export default function PasswordSection({
  isChangingPassword,
  changePasswordError,
  changePasswordSuccess,
  handleChangePassword,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Fjern mellemrum fra input (også ved paste)
  const handleCurrentPasswordChange = (val: string) => {
    setCurrentPassword(val.replace(/\s/g, ""));
  };
  const handleNewPasswordChange = (val: string) => {
    setNewPassword(val.replace(/\s/g, ""));
  };

  // Password krav
  const requirements = [
    { test: (pw: string) => /[A-Z]/.test(pw), label: "1 stort bogstav" },
    { test: (pw: string) => /[^a-z0-9]/gi.test(pw), label: "1 specialtegn" },
    { test: (pw: string) => pw.length >= 8, label: "8 tegn" },
  ];

  const passedCount = requirements.reduce((acc, req) => acc + (req.test(newPassword) ? 1 : 0), 0);
  const isNewPasswordInvalid = newPassword.length > 0 && passedCount < requirements.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNewPasswordInvalid) return;
    await handleChangePassword(currentPassword, newPassword);
    setIsEditing(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  // "Fake" password dots til visning i disabled state
  const fakeDots = "••••••••";

  return (
    <div className="bg-zinc-900/60 rounded-lg border border-zinc-700/50 p-4 mt-8">
      <div className="flex justify-between items-center mb-3 border-b border-zinc-700/50">
        <span className="text-base font-semibold text-zinc-200">Adgangskode</span>
        {!isEditing ? (
          <Button
            size="sm"
            variant="light"
            color="warning"
            onPress={() => setIsEditing(true)}
            startContent={<FaEdit size={16} />}
          >
            Rediger
          </Button>
        ) : (
          <div className="space-x-2">
            <Button
              type="submit"
              size="sm"
              color="success"
              className="text-light"
              isLoading={isChangingPassword}
              isDisabled={
                isNewPasswordInvalid ||
                newPassword.length === 0 ||
                currentPassword.length === 0
              }
            >
              Gem
            </Button>
            <Button
              size="sm"
              color="secondary"
              variant="solid"
              onPress={() => {
                setIsEditing(false);
                setCurrentPassword("");
                setNewPassword("");
              }}
              isDisabled={isChangingPassword}
            >
              Annuller
            </Button>
          </div>
        )}
      </div>
      <form className="grid gap-4 dark" autoComplete="off" onSubmit={handleSubmit}>
        <div className="relative">
          <Input
            type={showCurrent ? "text" : "password"}
            placeholder="Nuværende adgangskode"
            value={isEditing ? currentPassword : fakeDots}
            onValueChange={handleCurrentPasswordChange}
            required
            autoComplete="current-password"
            size="md"
            startContent={
              <FaKey className="text-lg text-default-400 pointer-events-none shrink-0" />
            }
            disabled={!isEditing}
          />
          {isEditing && (
            <button
              type="button"
              onClick={() => setShowCurrent(v => !v)}
              className="absolute right-2 top-3 text-sm text-gray-600"
              tabIndex={-1}
            >
              {showCurrent ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
            </button>
          )}
        </div>
        <div className="relative">
          <Input
            type={showNew ? "text" : "password"}
            placeholder="Ny adgangskode"
            value={isEditing ? newPassword : fakeDots}
            onValueChange={handleNewPasswordChange}
            required
            autoComplete="new-password"
            isInvalid={isEditing && isNewPasswordInvalid}
            size="md"
            startContent={
              <FaKey className="text-lg text-default-400 pointer-events-none shrink-0" />
            }
            disabled={!isEditing}
          />
          {isEditing && (
            <button
              type="button"
              onClick={() => setShowNew(v => !v)}
              className="absolute right-2 top-3 text-sm text-gray-600"
              tabIndex={-1}
            >
              {showNew ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
            </button>
          )}
        </div>
        {/* Password krav chips */}
        {isEditing && (
          <div className="flex flex-wrap gap-2 mt-1">
            {requirements.map(req => (
              <Chip
                key={req.label}
                color={req.test(newPassword) ? "success" : "default"}
                variant={req.test(newPassword) ? "solid" : "bordered"}
                size="sm"
                className="text-xs"
              >
                {req.label}
              </Chip>
            ))}
          </div>
        )}
        {isEditing && changePasswordError && (
          <div className="text-red-400 text-sm">{changePasswordError}</div>
        )}
        {isEditing && changePasswordSuccess && (
          <div className="text-green-400 text-sm">Adgangskode opdateret!</div>
        )}
      </form>
    </div>
  );
}