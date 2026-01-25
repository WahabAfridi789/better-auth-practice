"use client";

import { useState, useEffect } from "react";
import { organization } from "@/lib/auth/auth-client";

interface OrganizationMembersProps {
  organizationId: string;
}

interface Member {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export function OrganizationMembers({
  organizationId,
}: OrganizationMembersProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");
      // Type signature shows organizationId is optional in query params
      // Using type assertion to work with the API
      const result = await organization.listMembers(
        { query: { organizationId } }
      );
      if (result.data) {
        // Response structure: { members: Member[], total: number } or Member[]
        type MembersResponse = { members?: Member[]; total?: number } | Member[];
        const responseData = result.data as MembersResponse;
        const membersData = Array.isArray(responseData)
          ? responseData
          : (responseData as { members?: Member[] }).members || [];
        setMembers(membersData);
      } else if (result.error) {
        setError(result.error.message || "Failed to load members");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    try {
      setInviting(true);
      const result = await organization.inviteMember({
        organizationId,
        email: inviteEmail,
        role: inviteRole as "owner" | "admin" | "member",
      });

      if (result.error) {
        setError(result.error.message || "Failed to invite member");
      } else {
        setInviteEmail("");
        loadMembers();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      const result = await organization.removeMember({
        memberIdOrEmail: memberId,
        organizationId,
      });

      if (result.error) {
        setError(result.error.message || "Failed to remove member");
      } else {
        loadMembers();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      const result = await organization.updateMemberRole({
        organizationId,
        memberId,
        role: newRole as "owner" | "admin" | "member",
      });

      if (result.error) {
        setError(result.error.message || "Failed to update role");
      } else {
        loadMembers();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Members
        </h3>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Invite Member Form */}
      <form onSubmit={handleInvite} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">
          Invite Member
        </h4>
        <div className="flex gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="email@example.com"
            required
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            title="Role"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
          <button
            type="submit"
            disabled={inviting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
          >
            {inviting ? "Inviting..." : "Invite"}
          </button>
        </div>
      </form>

      {/* Members List */}
      <div className="space-y-2">
        {members.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No members yet
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {member.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.user.image}
                    alt={member.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {member.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {member.user.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  title="Role"
                  value={member.role}
                  onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
