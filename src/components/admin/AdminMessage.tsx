type AdminMessageProps = {
  message: string;
};

const AdminMessage = ({ message }: AdminMessageProps) => {
  if (!message) return null;

  const isError = message.includes("Error");

  return (
    <div
      className={`rounded-lg p-4 ${
        isError ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
      }`}
    >
      {message}
    </div>
  );
}

export default AdminMessage;