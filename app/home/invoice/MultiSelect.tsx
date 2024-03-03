// import React, { useState } from 'react';
// import styles from './select.module.css'

// const MultiSelect = () => {
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

//   const toggleOption = (option:string) => {
//     if(!option) return;
//     if (selectedOptions.includes(option)) {
//       setSelectedOptions(selectedOptions.filter((item) => item !== option));
//     } else {
//       setSelectedOptions([...selectedOptions, option]);
//     }
//   };

//   return (
//     <>
//       <div className={styles.multiselect} id="countries" multiple="multiple" data-target="multi-0">
//         <div className={`${styles.title}${styles.noselect}`}>
//             <span className={styles.text}>Select</span>
//             <span className={styles.closeIcon}>&times;</span>
//             <span className={styles.expandIcon}>&plus;</span>
//         </div>
//         <div className={styles.container}>
//             <option value="us">USA</option>
//             <option value="fr">France</option>
//             <option value="gr">Greece</option>
//             <option value="uk">United Kingdom</option>
//             <option value="ge">Germany</option>
//             <option value="sp">Spain</option>
//             <option value="it">Italy</option>
//             <option value="ch">China</option>
//             <option value="jp">Japan</option>
//         </div>
//     </div>
//     <div style={{marginTop: '10px'}}>
//         You can select multiple values from the dropdown and delete all of them at the same time, by clicking on the 'x' button.
//     </div>
//   </>
//   );
// };

// export default MultiSelect;
