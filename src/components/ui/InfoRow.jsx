export default function InfoRow({ icon, label, value, isLink, href }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-blue-100 rounded-lg p-2 text-blue-600">
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>

        {isLink ? (
          <a
            href={href}
            className="text-blue-600 hover:underline break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        ) : (
          <p className="text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
}
