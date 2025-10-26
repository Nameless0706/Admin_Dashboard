"use client";

import React, { useState, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Alert from "@/components/ui/alert/Alert";
import { useParams } from "next/navigation";

export default function FormElements() {
  const params = useParams(); 
  const userId = params?.userId; 

  const [user, setUser] = useState({
    email: "",
    name: "",
    headline: "",
    curr_company: "",
    curr_location: "",
    about: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const apiUrl = `http://localhost:5000/api/admin/users/${userId}`;

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (res.ok) {
          setUser({
            email: data.user.email || "",
            name: data.user.profile?.name || "",
            headline: data.user.profile?.headline || "",
            curr_company: data.user.profile?.curr_company || "",
            curr_location: data.user.profile?.curr_location || "",
            about: data.user.profile?.about || "",
          });
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle update
  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("User updated successfully!");
        setShowSuccess(true); 
        setTimeout(() => setShowSuccess(false), 3000); // auto-hide after 3s
      } else {
        setMessage(`Failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setMessage("Error updating user");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading user info...</div>;

  return (
    <div className="flex justify-center w-full mt-10 relative">
      <div className="space-y-6 w-[60%]">
        <ComponentCard title="Edit user info">
          <Label>Email</Label>
          <Input name="email" type="text" value={user.email} onChange={handleChange} />

          <Label>Display name</Label>
          <Input name="name" type="text" value={user.name} onChange={handleChange} />

          <Label>Headline</Label>
          <Input name="headline" type="text" value={user.headline} onChange={handleChange} />

          <Label>Current company</Label>
          <Input
            name="curr_company"
            type="text"
            value={user.curr_company}
            onChange={handleChange}
          />

          <Label>Current location</Label>
          <Input
            name="curr_location"
            type="text"
            value={user.curr_location}
            onChange={handleChange}
          />

          <Label>About</Label>
          <TextArea
            name="about"
            value={user.about}
            onChange={(e) => handleChange(e as any)}
            rows={6}
          />

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              disabled={updating}>
              {updating ? "Updating..." : "Update"}
            </button>
          </div>
        </ComponentCard>

      </div>

      {showSuccess && (
        <div className="fixed top-21 right-3 z-50 w-65">
          <Alert
            variant="success"
            title="Update successful"
            message={message}
            showLink={false}
          />
        </div>
      )}
    </div>
  );
}
