import { RegisterForm } from "@/components/AuthShell";

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] grid place-items-center">
      <div className="w-full max-w-md">
        <div className="absolute -z-10 inset-0 bg-[radial-gradient(600px_300px_at_50%_-20%,rgba(124,58,237,.18),transparent),radial-gradient(400px_220px_at_80%_10%,rgba(34,211,238,.15),transparent)]" />
        <RegisterForm />
      </div>
    </div>
  );
}
