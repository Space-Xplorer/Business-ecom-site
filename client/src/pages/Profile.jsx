import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/user/dashboard", { withCredentials: true })
      .then(res => {
        setUser(res.data.user);
        setForm(res.data.user);
        setLoading(false);
      })
      .catch(err => {
        setError("You must be logged in to view this page.");
        setLoading(false);
        setTimeout(() => navigate("/login"), 1500);
      });
  }, [navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put("http://localhost:8080/user/profile", form, { withCredentials: true });
      setUser(res.data.user);
      setForm(res.data.user);
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading profile...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-xl mx-auto mt-20 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-6 text-[#F26A1B] text-center">User Profile</h2>
      {editMode ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">First Name</label>
            <input name="firstName" value={form.firstName || ''} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Last Name</label>
            <input name="lastName" value={form.lastName || ''} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input name="email" value={form.email || ''} onChange={handleChange} className="w-full border px-3 py-2 rounded" disabled />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input name="phone" value={form.phone || ''} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
          {/* Addresses could be edited in a modal or separate section */}
          <div className="flex gap-4 mt-4">
            <button type="submit" className="bg-[#F26A1B] text-white px-4 py-2 rounded font-bold" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" className="bg-gray-300 text-black px-4 py-2 rounded font-bold" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div><span className="font-semibold">First Name:</span> {user.firstName || <span className="text-gray-400">Not set</span>}</div>
          <div><span className="font-semibold">Last Name:</span> {user.lastName || <span className="text-gray-400">Not set</span>}</div>
          <div><span className="font-semibold">Email:</span> {user.email}</div>
          <div><span className="font-semibold">Phone:</span> {user.phone || <span className="text-gray-400">Not set</span>}</div>
          {/* Addresses */}
          <div>
            <span className="font-semibold">Addresses:</span>
            {user.addresses && user.addresses.length > 0 ? (
              <ul className="list-disc ml-6">
                {user.addresses.map((addr, i) => (
                  <li key={i}>{typeof addr === 'string' ? addr : `${addr.street}, ${addr.city}, ${addr.state}, ${addr.country} - ${addr.postalCode}`}</li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-400 ml-2">No addresses added</span>
            )}
          </div>
          <button className="bg-[#F26A1B] text-white px-4 py-2 rounded font-bold mt-4" onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
} 