"use client";

export default function ConfirmPostForm({
  action,
  children,
  message = "Cancel this task?",
}: {
  action: string;
  children: React.ReactNode;
  message?: string;
}) {
  function onSubmit(e: React.FormEvent) {
    if (!confirm(message)) e.preventDefault();
  }
  return (
    <form action={action} method="post" onSubmit={onSubmit}>
      {children}
    </form>
  );
}
