export function getStatusBadgeClasses(status: string | undefined): string {
  switch (status) {
    case "confirmed":
    case "delivered":
      return "bg-green-100 text-green-800 ring-1 ring-green-200";
    case "shipped":
      return "bg-blue-100 text-blue-800 ring-1 ring-blue-200";
    case "preparing":
    case "pending":
      return "bg-amber-100 text-amber-800 ring-1 ring-amber-200";
    case "cancelled":
      return "bg-red-100 text-red-800 ring-1 ring-red-200";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  }
}
