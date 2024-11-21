 import { JSX } from "preact";

 export default function Profile() {
   return (
     <div style={styles.container}>
       <div style={styles.avatarContainer}>
         <img
           src="https://via.placeholder.com/150"
           alt="Avatar"
           style={styles.avatar}
         />
       </div>
       <div style={styles.detailsContainer}>
         <div style={styles.field}>
           <strong>Name:</strong> John Doe
         </div>
         <div style={styles.field}>
           <strong>Nickname:</strong> Johnny
         </div>
         <div style={styles.field}>
           <strong>Kakao:</strong> <a href="https://kakao.com/johndoe">Profile Link</a>
         </div>
         <div style={styles.field}>
           <strong>Email:</strong> johndoe@example.com
         </div>
         <div style={styles.field}>
           <strong>Password:</strong> ••••••••
         </div>
       </div>
       <button style={styles.editButton}>Edit Profile</button>
     </div>
   );
 }

 const styles = {
   container: {
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'space-between',
     padding: '20px',
     border: '1px solid #ccc',
     borderRadius: '8px',
     maxWidth: '600px',
     margin: 'auto',
     position: 'relative',
   },
   avatarContainer: {
     flexShrink: 0,
   },
   avatar: {
     width: '150px',
     height: '150px',
     borderRadius: '50%',
   },
   detailsContainer: {
     flexGrow: 1,
     marginLeft: '20px',
   },
   field: {
     marginBottom: '10px',
   },
   editButton: {
     position: 'absolute',
     bottom: '10px',
     right: '10px',
     padding: '8px 16px',
     backgroundColor: '#007bff',
     color: '#fff',
     border: 'none',
     borderRadius: '4px',
     cursor: 'pointer',
   },
 };