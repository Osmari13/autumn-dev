import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import logo from "../../public/BERKANA-LOGO.jpg";//C:\Users\obarriga\desktop\berkana-dev\public\BERKANA-LOGO-TEXTO-VERDE.png

const PdfFile = () => {
    const style = StyleSheet.create({
        page:{
            padding:20,
        },
        header:{
            flexDirection:"row",
            marginBottom:"15px",
            gap:5,
            justifyContent:"space-between",
            alignItems:"center"
        },
        logo:{
            color:'#63c144',
            height:"auto",
            fontWeight:"bold"
        },
        textConteiner:{
            alignItems:"center",
            marginLeft:"20px"
        },
        textOne:{
            fontSize:"18px",
            fontWeight:"bold",
            letterSpacing:"2px",
            marginBottom:"3px"

        },
        tableHeader:{
            flexDirection:'row',
            border:1,
            borderColor:'#000000'
        },
        tableColumn1:{
            width:"20%",
            textAlign:"left",
            fontSize:"11px",
            paddingBottom:"10px",
            paddingTop:"10px",
            marginLeft:"11px",
            borderColor:'#000000'

        },
        tableColumn2:{
            width:"40%",
            textAlign:"left",
            fontSize:"11px",
            paddingBottom:"10px",
            borderLeft:1,
            paddingTop:"10px",
            marginLeft:"11px",
            borderColor:'#000000'
        },
        tableRow:{
            flexDirection:"row",
            border:1,
            borderTop:"none",
            borderColor:'#000000'
        },
        


    })
 

  return (
    <Document>
        <Page size='A4' style={style.page}>
            <View style={style.header}>
                <View>
                    <Text style={style.logo}>Berkana</Text>
                </View>
                <View style={style.textConteiner}>
                    <Text style={style.textOne}>Reporte Diario</Text>
                </View>
            </View>
            <View style={style.tableHeader}>
                <Text style={style.tableColumn1}>ID</Text>
                <Text style={style.tableColumn2}>TICKET</Text>
                <Text style={style.tableColumn2}>FARE</Text>
                <Text style={style.tableColumn2}>TAX</Text>
                <Text style={style.tableColumn2}>FEE</Text>
                <Text style={style.tableColumn2}>COMM</Text>
                <Text style={style.tableColumn2}>NET</Text>
                <Text style={style.tableColumn2}>FP</Text>
                <Text style={style.tableColumn2}>TRANS</Text>
                <Text style={style.tableColumn2}>RELOC</Text>
                <Text style={style.tableColumn2}>PAX NAME</Text>
                <Text style={style.tableColumn2}>OBS</Text>
            </View>
            <View style={style.tableRow}>

            </View>
        </Page>
    </Document>
  );
};

export default PdfFile;


