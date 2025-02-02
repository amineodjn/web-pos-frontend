// import React, { useEffect, useState } from 'react';
// import { useApi } from '../hooks/useApi';
// import { Button } from '../components/Button'; // Assume you will create a reusable Button component

// interface OrderPageProps {
//   token: string;
// }

// const OrderPage: React.FC<OrderPageProps> = ({ token }) => {
//   const { data: orders, error, isLoading, mutate } = useApi('/orders', token);

//   const handleUpdateOrder = async (orderId: number) => {
//     const updatedOrderData = {
//       status: 'Completed',
//       table_number: 3,
//       items: [
//         { menu_item_id: 1, quantity: 3 },
//         { menu_item_id: 4, quantity: 1 },
//       ],
//     };

//     try {
//       // Call your update order API here
//       await fetch(`http://localhost:5000/api/order/${orderId}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedOrderData),
//       });

//       // Revalidate data
//       mutate();
//     } catch (error) {
//       console.error('Error updating order:', error);
//     }
//   };

//   if (isLoading) return <div>Loading orders...</div>;
//   if (error) return <div>Error loading orders</div>;

//   return (
//     <div>
//       <h1>Order Management</h1>
//       <ul>
//         {orders?.map((order: any) => (
//           <li key={order.id}>
//             <span>Order #{order.id} (Table {order.table_number})</span>
//             <Button onClick={() => handleUpdateOrder(order.id)}>Complete Order</Button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default OrderPage;
