import { API_BASE_URL } from '../../api/axios'
import { TransactionLog } from '../../types'

const RecentTransactions = ({ data }: { data: TransactionLog[] }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-3 text-sm font-semibold text-slate-700">Recent Transactions</div>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2">Tx Id</th>
            <th className="py-2">Status</th>
            <th className="py-2">Reason</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.length ? (
            data.map((tx) => (
              <tr key={tx.txId} className="border-t text-slate-700">
                <td className="py-2">
                  <a
                    className="text-primary-600 hover:underline"
                    href={`${API_BASE_URL}/api/tx/logs/${tx.txId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {tx.txId}
                  </a>
                </td>
                <td className="py-2">{tx.status}</td>
                <td className="py-2">{tx.reason || '-'}</td>
                <td className="py-2">{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-4 text-center text-slate-500">
                No transactions logged.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)

export default RecentTransactions


