import { useEffect, useState, useCallback } from "react";
import { profileApi } from "../api/profileApi";
import {
  User,
  Lock,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    defaultAddress: false,
  });

  const fetchProfile = useCallback(async () => {
    try {
      const response = await profileApi.getProfile();
      setProfile(response.data.data);
      setName(response.data.data.name);
    } catch {
      toast.error("Failed to fetch profile");
    }
  }, []);

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await profileApi.getAddresses();
      setAddresses(response.data.data);
    } catch {
      toast.error("Failed to fetch addresses");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAddresses();
  }, [fetchProfile, fetchAddresses]);

  const handleUpdateName = async () => {
    try {
      await profileApi.updateProfile({ name });
      toast.success("Profile updated!");
      setEditingName(false);
      fetchProfile();
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await profileApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await profileApi.updateAddress(editingAddress.id, addressForm);
        toast.success("Address updated!");
      } else {
        await profileApi.addAddress(addressForm);
        toast.success("Address added!");
      }
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm({
        street: "",
        city: "",
        state: "",
        pincode: "",
        defaultAddress: false,
      });
      fetchAddresses();
    } catch {
      toast.error("Failed to save address");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await profileApi.deleteAddress(id);
      toast.success("Address deleted!");
      fetchAddresses();
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      defaultAddress: address.defaultAddress,
    });
    setShowAddressForm(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Account</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { key: "profile", label: "Profile", icon: <User size={16} /> },
          { key: "password", label: "Password", icon: <Lock size={16} /> },
          { key: "addresses", label: "Addresses", icon: <MapPin size={16} /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition whitespace-nowrap shrink-0 text-sm md:text-base md:px-5 ${
              activeTab === tab.key
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* PROFILE TAB */}
      {activeTab === "profile" && profile && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-2xl">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{profile.name}</p>
              <p className="text-gray-500">{profile.email}</p>
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-medium">
                {profile.role === "ROLE_ADMIN" ? "Admin" : "Customer"}
              </span>
            </div>
          </div>

          {/* Edit Name */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            {editingName ? (
              <div className="flex gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleUpdateName}
                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={() => setEditingName(false)}
                  className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-2">
                <span className="text-gray-800">{profile.name}</span>
                <button
                  onClick={() => setEditingName(true)}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="border-t pt-4 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50">
              <span className="text-gray-500">{profile.email}</span>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Since
            </label>
            <div className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50">
              <span className="text-gray-500">
                {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD TAB */}
      {activeTab === "password" && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      )}

      {/* ADDRESSES TAB */}
      {activeTab === "addresses" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Saved Addresses</h2>
            <button
              onClick={() => {
                setShowAddressForm(true);
                setEditingAddress(null);
                setAddressForm({
                  street: "",
                  city: "",
                  state: "",
                  pincode: "",
                  defaultAddress: false,
                });
              }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Plus size={18} /> Add Address
            </button>
          </div>

          {showAddressForm && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {editingAddress ? "Edit Address" : "New Address"}
              </h3>
              <form
                onSubmit={handleAddressSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street *
                  </label>
                  <input
                    required
                    value={addressForm.street}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, street: e.target.value })
                    }
                    placeholder="123 Main Street"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    required
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    placeholder="Bengaluru"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    required
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    placeholder="Karnataka"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    required
                    value={addressForm.pincode}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        pincode: e.target.value,
                      })
                    }
                    placeholder="560001"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="default"
                    checked={addressForm.defaultAddress}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        defaultAddress: e.target.checked,
                      })
                    }
                    className="accent-indigo-600"
                  />
                  <label htmlFor="default" className="text-sm text-gray-700">
                    Set as default address
                  </label>
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium"
                  >
                    {editingAddress ? "Update" : "Add Address"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {addresses.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl">
              <MapPin size={40} className="mx-auto text-gray-300 mb-3" />
              No addresses saved yet
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-start"
                >
                  <div>
                    {address.defaultAddress && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium mb-2 inline-block">
                        Default
                      </span>
                    )}
                    <p className="font-medium text-gray-800">
                      {address.street}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
