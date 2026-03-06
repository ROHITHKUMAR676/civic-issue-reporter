export default function DeptIssueCard({ issue, onUpload }) {
  return (
    <div
      className="
      bg-slate-800
      rounded-xl
      p-4 sm:p-5
      space-y-3 sm:space-y-4
      shadow-md
      hover:bg-slate-700
      transition
    "
    >

      {/* IMAGE */}
      <img
        src={issue.imageUrl}
        alt=""
        className="
        h-36 sm:h-40
        w-full
        object-cover
        rounded-lg
      "
      />

      {/* TITLE */}
      <h3 className="text-base sm:text-lg font-semibold text-white">
        {issue.title}
      </h3>

      {/* ADDRESS */}
      <p className="text-xs sm:text-sm text-slate-400">
        {issue.location?.address}
      </p>

      {/* STATUS ROW */}
      <div className="flex justify-between items-center flex-wrap gap-2">

        <span className="px-2 py-1 text-xs sm:text-sm rounded bg-indigo-600">
          {issue.priority}
        </span>

        <span
          className={`text-xs sm:text-sm ${
            issue.slaStatusComputed.includes("Breached")
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {issue.slaStatusComputed}
        </span>

      </div>

      {/* BUTTON */}
      <button
        onClick={() => onUpload(issue)}
        className="
          w-full
          bg-green-500 hover:bg-green-600
          py-2 sm:py-2.5
          rounded-lg
          text-sm sm:text-base
          font-medium
          transition
        "
      >
        Upload Proof
      </button>

    </div>
  );
}