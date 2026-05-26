import { useAuthStore } from "~/features/auth/auth.store";
import { useState } from "react";
import UserBadge from "./user-badge";

export default function UserList() {
	const [ hover, setHover ] = useState(false);
	const [ open, setOpen ] = useState(false);

	const { isLoading } = useAuthStore();
	
	return <>
		{ open && <>
			<div
				style={{
					position: "fixed",
					bottom: 16,
					right: 16,
					top: 96,

					width: 424,

					overflow: "hidden scroll",
					border: "2px solid white",
					backgroundColor: "black",
				
					opacity: isLoading ? 0.5 : 1
				}}
			>
				<UserBadge username="John Doe" bodycount={5} image="/avatar.png" />
				<UserBadge username="Jane Doe" bodycount={5} image="/avatar.png" />
				<UserBadge username="Jordan Doe" bodycount={5} image="/avatar.png" />
				<UserBadge username="John Doe" bodycount={5} image="/avatar.png" />
				<UserBadge username="Jane Doe" bodycount={5} image="/avatar.png" />
				<UserBadge username="Jordan Doe" bodycount={5} image="/avatar.png" />
				<UserBadge username="John Doe" bodycount={5} image="/avatar.png" />
				<UserBadge username="Jane Doe" bodycount={5} image="/avatar.png" />
				<UserBadge username="Jordan Doe" bodycount={5} image="/avatar.png" />
				<UserBadge username="John Doe" bodycount={5} image="/avatar.png" />
				<UserBadge username="Jane Doe" bodycount={5} image="/avatar.png" />
				<UserBadge username="Jordan Doe" bodycount={5} image="/avatar.png" />
				<UserBadge username="John Doe" bodycount={5} image="/avatar.png" />
				<UserBadge username="Jane Doe" bodycount={5} image="/avatar.png" />
				<UserBadge username="Jordan Doe" bodycount={5} image="/avatar.png" />
			</div>

			<div
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onClick={() => { setOpen(false); setHover(false); }}

				style={{
					position: "fixed",
					bottom: 16,
					right: 448,

					width: 32,
					height: 32,

					overflow: "hidden",
					border: "2px solid white",
					backgroundColor: hover ? "white" : "black",
					color: hover ? "black" : "white",
				
					opacity: isLoading ? 0.5 : 1,

					justifyContent: "center",
					alignItems: "center",
					display: "flex",
				}}
			>
				{">"}
			</div>
		</> }

		{ !open && 
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
					border: "2px solid white",
					backgroundColor: hover ? "white" : "black",
					color: hover ? "black" : "white",
				
					opacity: isLoading ? 0.5 : 1,

					justifyContent: "center",
					alignItems: "center",
					display: "flex",
				}}
			>
				{"<"}
			</div>
		}
	</>
}