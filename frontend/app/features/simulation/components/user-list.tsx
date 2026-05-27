import { useAuthStore } from "~/features/auth/auth.store";
import { useEffect, useState } from "react";
import UserBadge from "./user-badge";
import { useUsers } from "../user-list.store";
import { useSimulationContext } from "./simulation-provider";
import { usersApi } from "~/features/users/users.api";

export default function UserList() {
	const [hover, setHover] = useState(false);
	const [open, setOpen] = useState(false);
	const [socketMap, setSocketMap] = useState<Record<string, string[]>>({});

	const { currentRoom } = useSimulationContext();
	const { isLoading } = useAuthStore();
	const { users, load } = useUsers();
	const { simState } = useSimulationContext();

	useEffect(() => {
		load(currentRoom);
	}, [load]);

	useEffect(() => {
		if (!users?.length) return;

		const fetchSocketIds = async () => {
			const entries = await Promise.all(
				users.map(async (user) => {
					const socketIds = await usersApi.getSocketIdsByUserId(user.id);
					return [user.id, socketIds] as const;
				})
			);
			setSocketMap(Object.fromEntries(entries));
		};

		fetchSocketIds();
	}, [users]);

	const getBodyCount = (userId: string): number => {
		const socketIds = socketMap[userId];
		if (!socketIds?.length || !simState?.bodies) return 0;
		const socketSet = new Set(socketIds);
		return [...simState.bodies.values()].filter((body) => {
			return socketSet.has(body.owner);
		}).length;
	};

	return <>
		{open && <>
			<div
				style={{
					position: "fixed",
					bottom: 16,
					right: 16,
					top: 26,
					width: 389,
					overflow: "hidden scroll",
					border: "1px solid white",
					backgroundColor: "black",
					opacity: isLoading ? 0.5 : 1
				}}
			>
				{users?.map(user => (
					<UserBadge
						key={user.id}
						username={user.firstName + user.lastName}
						bodycount={getBodyCount(user.id)}
						icon={user.icon}
						color={user.color}
					/>
				))}
			</div>

			<div
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onClick={() => { setOpen(false); setHover(false); }}

				style={{
					position: "fixed",
					bottom: 16,
					right: 412,

					width: 32,
					height: 32,

					overflow: "hidden",
					border: "1px solid white",
					backgroundColor: hover ? "white" : "black",
					color: hover ? "black" : "white",

					opacity: isLoading ? 0.5 : 1,

					justifyContent: "center",
					alignItems: "center",
					display: "flex",

					cursor: "pointer"
				}}
			>
				{">"}
			</div>
		</>}

		{!open &&
			<div
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onClick={() => { setOpen(true); setHover(false); }}

				style={{
					position: "fixed",
					bottom: 16,
					right: 16,

					width: 32,
					height: 32,

					overflow: "hidden",
					border: "1px solid white",
					backgroundColor: hover ? "white" : "black",
					color: hover ? "black" : "white",

					opacity: isLoading ? 0.5 : 1,

					justifyContent: "center",
					alignItems: "center",
					display: "flex",

					cursor: "pointer"
				}}
			>
				{"<"}
			</div>
		}
	</>
}
