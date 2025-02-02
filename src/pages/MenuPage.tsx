// import React from 'react';
// import { useApi } from '../hooks/useApi';
// import { Button } from '../components/Button'; // Assume you will create a reusable Button component

// interface MenuPageProps {
//   token: string;
// }

// const MenuPage: React.FC<MenuPageProps> = ({ token }) => {
//   const { data: menuItems, error, isLoading } = useApi('/menu', token);

//   if (isLoading) return <div>Loading menu...</div>;
//   if (error) return <div>Error loading menu</div>;

//   return (
//     <div>
//       <h1>Menu</h1>
//       <ul>
//         {menuItems?.map((item: any) => (
//           <li key={item.id}>
//             <span>{item.name} - ${item.price}</span>
//             <Button>Add to Order</Button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MenuPage;
