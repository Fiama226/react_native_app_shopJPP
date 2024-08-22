import { View, Text,StatusBar,FlatList, Pressable,StyleSheet,SafeAreaView,Image,Modal } from 'react-native'
import { Button } from 'react-native-paper';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import axios from 'axios'
import React from 'react'
import { Card } from '@rneui/themed'; 
import { useState,useEffect } from 'react'
import { CardDivider } from '@rneui/base/dist/Card/Card.Divider';
import { CardTitle } from '@rneui/base/dist/Card/Card.Title';
import { CardImage } from '@rneui/base/dist/Card/Card.Image';
const HeadMargin=StatusBar.currentHeight

const LoadingCard=()=>{

  return(
    <Card containerStyle={{height:"25%",backgroundColor:"white",width:"50%",marginTop:"50%",alignSelf:"center"}} >
    <Image source={require('./loading.gif')}style={{width:"100%",height:"50%"}} />
    <CardDivider />
    <CardTitle>Telechargement du recu......</CardTitle>
    
    </Card>
  )
}

const Table = ({details})=>{
  //console.log(details)
  const rowData=JSON.parse(details)
  return(
    <View>
      <View style={{flexDirection:"row"}}><View style={styles.tablecell}  ><Text>{rowData.name}</Text></View><View style={styles.tablecell} ><Text>{rowData.quantity}</Text></View><View style={styles.tablecell} ><Text>{rowData.price}</Text></View><View style={styles.tablecell} ><Text>{rowData.prices}</Text></View></View>
    </View>
  )
}


const shareFile = async (id) => {
    const fileUri = `https://jppshopbackend.onrender.com/printpdf?data=${id}`; // Replace with your file URL
  const localUri = FileSystem.documentDirectory + 'Landry.pdf'; // File will be saved as 'Landry.pdf' in the app's document directory

  try {
      const downloadResult = await FileSystem.downloadAsync(
          fileUri,
          localUri
      );
      console.log('Download result:', downloadResult);
      if (downloadResult.status === 200) {
          console.log('File downloaded to:', downloadResult.uri);
          await Sharing.shareAsync(downloadResult.uri);
          await setLoading(false)

          // Handle further operations if needed
      } else {
          console.error('Failed to download file');
      }
  } catch (error) {
      console.error('Error downloading file:', error);
  }
  

}

const RenderItemComponent = ({ item,setLoading}) => {
  const [opendetails, setOpendetails] = useState(false);
  const [infofactures, setInfofactures] = useState(false); 

  //console.log(item.detailsdelafacture[0])
  return (
    <View style={{ backgroundColor: "#EDE8F5", margin: 10, padding: 25 }}>
      <View>
        <Text>Nom du client: {item.nomduclient}</Text>
        <Text>Commande numéro: {item.numerodefacture}</Text>
        <Text>Date: {item.date}</Text>
        <Text>Mode de paiement: {item.modedepayement}</Text>
        <Text>Montant total de la commande: {item.montantdelacommande} FCFA</Text>
      </View>
      <View>
        <Pressable onPress={() => setOpendetails(!opendetails)}>
          <Text style={{textAlign:"center",margin:15}}>Afficher détails</Text>
        </Pressable>
      </View>
      {  opendetails && (
        <View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.tablehead}><Text>Article</Text></View>
            <View style={styles.tablehead}><Text>Quantité</Text></View>
            <View style={styles.tablehead}><Text>Prix unitaire</Text></View>
            <View style={styles.tablehead}><Text>Subtotal</Text></View>
          </View>         
          <FlatList
            data={item.detailsdelafacture}
            renderItem={({ item }) => <Table details={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
          <Button icon="share-variant" mode="contained" onPress={()=>{shareFile(item.id),setLoading(true)}} style={{margin:10,width:"50%", alignSelf:"flex-end"}}>Partager la facture </Button>

        </View>
      ) }
    </View>
  );
};


const History_view = () => {
  const [loadingModal,setLoadingModal]= useState(false)
  const [data, setData] = useState([])
  useEffect(()=>{ 
    const fetchData =()=>{ axios.get('https://jppshopbackend.onrender.com/commandes').then(res=>setData(res.data)).catch(function (error) {console.log(error);})     
     }
    fetchData()
    },)

  return (
    <SafeAreaView>
    <View style={{marginTop:HeadMargin}}>
    <Modal visible={loadingModal} style={{height:"50%",backgroundColor:"red"}} transparent={true}  >
      <LoadingCard  />
    </Modal>
    <View style={{marginTop:16,alignSelf:"center"}}>
      <Text style={{fontSize:25,fontWeight:"bold",textDecorationLine:"underline"}} >la liste de toutes les commandes</Text>
    </View>
      <FlatList
      data={data}
      renderItem={({item}) => <RenderItemComponent item={item} setLoading={setLoadingModal} />}
      style={{height:"90%"}}
       />
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  tablehead: {
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle:"solid",
    borderColor:"black",
    borderWidth:1,
    width:"25%",
  },
  tablecell:{
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle:"solid",
    borderColor:"black",
    borderWidth:1,
    width:"25%",
  }
})
export default History_view