const fragment = `id
					name
					description
					createdAt
					creator {
						id
						email
						firstName
						lastName
						color
						icon
					}
					memberships {
						id
					}`;

export const gqlQueries = {
    get: `
        query($search: String) {
            searchRooms(search: $search) {
                ${fragment}
            }
        }
    `,

    create: `
        mutation($input: CreateRoomDto!) {
            createRoom(input: $input) {
                ${fragment}
            }
        }
    `,

    edit: `
        mutation($roomId: String!, $input: UpdateRoomDto!) {
            updateRoom(roomId: $roomId, input: $input) {
                ${fragment}
            }
        }
    `,

    delete: `
        mutation($roomId: String!) {
            deleteRoom(roomId: $roomId)
        }
    `,
}