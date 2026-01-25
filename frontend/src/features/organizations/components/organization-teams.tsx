"use client";

import { useState, useEffect } from "react";
import { organization } from "@/lib/auth/auth-client";
import { Team } from "better-auth/plugins";

interface OrganizationTeamsProps {
  organizationId: string;
}


export function OrganizationTeams({
  organizationId,
}: OrganizationTeamsProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await organization.listTeams({
        query: { organizationId },
      });
      if (result.data) {
        setTeams(result.data);
      } else if (result.error) {
        setError(result.error.message || "Failed to load teams");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to load teams");
      } else {
        setError("Failed to load teams");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName) return;

    try {
      setCreating(true);
      type OrganizationWithTeams = typeof organization & {
        createTeam: (params: { organizationId: string; name: string }) => Promise<{ data: Team; error: Error | null }>;
      };
      const orgWithTeams = organization as OrganizationWithTeams;

      const result = await orgWithTeams.createTeam({
        organizationId,
        name: newTeamName,
      });

      if (result.error) {
        setError(result.error.message || "Failed to create team");
      } else {
        setNewTeamName("");
        loadTeams();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to create team");
      } else {
        setError("Failed to create team");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    try {
      type OrganizationWithTeams = typeof organization & {
        removeTeam: (params: { organizationId: string; teamId: string }) => Promise<{ data: Team; error: Error | null }>;
      };
      const orgWithTeams = organization as OrganizationWithTeams;

      const result = await orgWithTeams.removeTeam({
        organizationId,
        teamId,
      });

      if (result.error) {
        setError(result.error.message || "Failed to delete team");
      } else {
        loadTeams();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to delete team");
      } else {
        setError("Failed to delete team");
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
          Teams
        </h3>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Create Team Form */}
      <form onSubmit={handleCreateTeam} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">
          Create Team
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Team name"
            required
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </form>

      {/* Teams List */}
      <div className="space-y-2">
        {teams.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No teams yet
          </div>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {team.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Created {new Date(team.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteTeam(team.id)}
                className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
