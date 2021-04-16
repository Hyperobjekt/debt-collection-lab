// import React from "react";
// import PropTypes from "prop-types";
// import CssBaseline from "@material-ui/core/CssBaseline";
// import { ThemeProvider } from "@material-ui/core/styles";
// import { create } from "jss";
// import { jssPreset, StylesProvider } from "@material-ui/styles";
// import SiteTheme from "../../theme";
// import components from "../../components/mdx";
// import MDX from "@mdx-js/runtime";

// class DefaultPagePreview extends React.Component {
//   state = {
//     ready: false,
//   };

//   handleRef = (ref) => {
//     const ownerDocument = ref ? ref.ownerDocument : null;
//     this.setState({
//       ready: true,
//       jss: create({
//         ...jssPreset(),
//         insertionPoint: ownerDocument
//           ? ownerDocument.querySelector("#demo-frame-jss")
//           : null,
//       }),
//       sheetsManager: new Map(),
//     });
//   };

//   theme = SiteTheme;

//   render() {
//     const { entry, widgetFor } = this.props;
//     const data = entry.getIn(["data"]).toJS();
//     if (data) {
//       return (
//         <React.Fragment>
//           <div id="demo-frame-jss" ref={this.handleRef} />
//           {this.state.ready ? (
//             <StylesProvider
//               jss={this.state.jss}
//               sheetsManager={this.state.sheetsManager}
//             >
//               <ThemeProvider theme={this.theme}>
//                 <CssBaseline />
//                 <MDX components={components}>
//                   {entry.getIn(["data", "body"])}
//                 </MDX>
//               </ThemeProvider>
//             </StylesProvider>
//           ) : null}
//         </React.Fragment>
//       );
//     } else {
//       return <div>Loading...</div>;
//     }
//   }
// }

// DefaultPagePreview.propTypes = {
//   entry: PropTypes.shape({
//     getIn: PropTypes.func,
//   }),
//   widgetFor: PropTypes.func,
// };

// export default DefaultPagePreview;
