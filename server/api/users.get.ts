export default defineEventHandler((event) => {
  const query = getQuery(event);
  const role = query.role;
  const pageStr = Array.isArray(query.page) ? query.page[0] : query.page;
  const limitStr = Array.isArray(query.limit) ? query.limit[0] : query.limit;

  const page = pageStr ? parseInt(pageStr, 10) || 1 : 1;
  const limit = limitStr ? parseInt(limitStr, 10) || 10 : 10;

  // Mock users data with various roles
  const mockUsers = [
    {
      id: "1",
      email: "member1@example.com",
      fullname: "Member One",
      username: "member1",
      phone_number: "1234567890",
      address: "123 Main St",
      status: "approved",
      role: "member",
    },
    {
      id: "2",
      email: "member2@example.com",
      fullname: "Member Two",
      username: "member2",
      phone_number: "2345678901",
      address: "456 Elm St",
      status: "pending",
      role: "member",
    },
    {
      id: "3",
      email: "admin1@example.com",
      fullname: "Admin One",
      username: "admin1",
      phone_number: "3456789012",
      address: "789 Oak St",
      status: "approved",
      role: "admin",
    },
    {
      id: "4",
      email: "member3@example.com",
      fullname: "Member Three",
      username: "member3",
      phone_number: "4567890123",
      address: "101 Pine St",
      status: "approved",
      role: "member",
    },
    {
      id: "5",
      email: "member4@example.com",
      fullname: "Member Four",
      username: "member4",
      phone_number: "5678901234",
      address: "202 Maple St",
      status: "rejected",
      role: "member",
    },
    {
      id: "6",
      email: "admin2@example.com",
      fullname: "Admin Two",
      username: "admin2",
      phone_number: "6789012345",
      address: "303 Birch St",
      status: "approved",
      role: "admin",
    },
    {
      id: "7",
      email: "member5@example.com",
      fullname: "Member Five",
      username: "member5",
      phone_number: "7890123456",
      address: "404 Cedar St",
      status: "approved",
      role: "member",
    },
    {
      id: "8",
      email: "member6@example.com",
      fullname: "Member Six",
      username: "member6",
      phone_number: "8901234567",
      address: "505 Walnut St",
      status: "pending",
      role: "member",
    },
    {
      id: "9",
      email: "member7@example.com",
      fullname: "Member Seven",
      username: "member7",
      phone_number: "9012345678",
      address: "606 Chestnut St",
      status: "approved",
      role: "member",
    },
    {
      id: "10",
      email: "admin3@example.com",
      fullname: "Admin Three",
      username: "admin3",
      phone_number: "0123456789",
      address: "707 Spruce St",
      status: "approved",
      role: "admin",
    },
    {
      id: "11",
      email: "member8@example.com",
      fullname: "Member Eight",
      username: "member8",
      phone_number: "1234567890",
      address: "808 Fir St",
      status: "approved",
      role: "member",
    },
    {
      id: "12",
      email: "member9@example.com",
      fullname: "Member Nine",
      username: "member9",
      phone_number: "2345678901",
      address: "909 Hemlock St",
      status: "pending",
      role: "member",
    },
    {
      id: "13",
      email: "member10@example.com",
      fullname: "Member Ten",
      username: "member10",
      phone_number: "3456789012",
      address: "1010 Redwood St",
      status: "approved",
      role: "member",
    },
    {
      id: "14",
      email: "member11@example.com",
      fullname: "Member Eleven",
      username: "member11",
      phone_number: "4567890123",
      address: "1111 Sequoia St",
      status: "rejected",
      role: "member",
    },
    {
      id: "15",
      email: "admin4@example.com",
      fullname: "Admin Four",
      username: "admin4",
      phone_number: "5678901234",
      address: "1212 Cypress St",
      status: "approved",
      role: "admin",
    },
    {
      id: "16",
      email: "member12@example.com",
      fullname: "Member Twelve",
      username: "member12",
      phone_number: "6789012345",
      address: "1313 Aspen St",
      status: "approved",
      role: "member",
    },
    {
      id: "17",
      email: "member13@example.com",
      fullname: "Member Thirteen",
      username: "member13",
      phone_number: "7890123456",
      address: "1414 Poplar St",
      status: "pending",
      role: "member",
    },
    {
      id: "18",
      email: "member14@example.com",
      fullname: "Member Fourteen",
      username: "member14",
      phone_number: "8901234567",
      address: "1515 Sycamore St",
      status: "approved",
      role: "member",
    },
    {
      id: "19",
      email: "member15@example.com",
      fullname: "Member Fifteen",
      username: "member15",
      phone_number: "9012345678",
      address: "1616 Beech St",
      status: "approved",
      role: "member",
    },
    {
      id: "20",
      email: "admin5@example.com",
      fullname: "Admin Five",
      username: "admin5",
      phone_number: "0123456789",
      address: "1717 Willow St",
      status: "approved",
      role: "admin",
    },
    {
      id: "21",
      email: "member16@example.com",
      fullname: "Member Sixteen",
      username: "member16",
      phone_number: "1234567890",
      address: "1818 Alder St",
      status: "approved",
      role: "member",
    },
    {
      id: "22",
      email: "member17@example.com",
      fullname: "Member Seventeen",
      username: "member17",
      phone_number: "2345678901",
      address: "1919 Hickory St",
      status: "pending",
      role: "member",
    },
    {
      id: "23",
      email: "member18@example.com",
      fullname: "Member Eighteen",
      username: "member18",
      phone_number: "3456789012",
      address: "2020 Locust St",
      status: "approved",
      role: "member",
    },
    {
      id: "24",
      email: "member19@example.com",
      fullname: "Member Nineteen",
      username: "member19",
      phone_number: "4567890123",
      address: "2121 Magnolia St",
      status: "rejected",
      role: "member",
    },
    {
      id: "25",
      email: "member20@example.com",
      fullname: "Member Twenty",
      username: "member20",
      phone_number: "5678901234",
      address: "2222 Olive St",
      status: "approved",
      role: "member",
    },
  ];

  // Filter by role if provided
  let filteredUsers = mockUsers;
  if (role) {
    filteredUsers = mockUsers.filter((user) => user.role === role);
  }

  const total = filteredUsers.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = filteredUsers.slice(start, end);

  // Remove role from response data
  const responseData = data.map(({ role, ...rest }) => rest);

  const hasNext = end < total;
  const hasPrev = page > 1;

  return {
    data: responseData,
    page,
    limit,
    total,
    next: hasNext,
    prev: hasPrev,
  };
});
