import { useEffect, useState } from "react";
import { passwordAPI } from "../services/api";
import type { PasswordItem } from "../types/index"; 

function Dashboard() {
  const [passwords, setPasswords] = useState<PasswordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const handleView = async (id: number) => {
    try {
      const data = await passwordAPI.getOne(id);
      alert(data.decryptedPassword);
    } catch (err) {
      console.error("Error viewing password", err);
    }
  }
  const fetchPassword = async () => {
      try {
        const data = await passwordAPI.getAll();
        console.log("Got the password")
        setPasswords(data.passwords);
      } catch (err) {
        console.error("Error in get password", err);
      } finally {
        setLoading(false);
      }
  }
  useEffect(() => {
    fetchPassword();
  }, []);

  const handleDelete = async (id: number) => {
    await passwordAPI.delete(id);
    await fetchPassword();
  }
  if (loading) return (<p>Loading...</p>)
  if (passwords.length === 0) return (<p>The password is empty</p>)
  return (
    <div>
      {passwords.map((p) => (
        <div key={p.id} className="bg-white p-4 rounded shadow mb-3" >
          <p className="text">
            {p.website}
          </p>
          <p className="text">
            {p.username}
          </p>
          <button onClick={() => handleDelete(p.id)}>Delete</button>
          <button onClick={()=> handleView(p.id)}>View</button>
        </div >
      )
      )}
    </div>
  );
}

export default Dashboard;