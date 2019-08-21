<template>
  <!--<el-button icon="el-icon-download" v-on:click="pdfgen">{{ $t('household.buttons.download') }}</el-button>-->
  <el-button icon="el-icon-download" v-on:click="pdfgen" circle/>
</template>

<script>
  var now = new Date();
  console.log(new Date() - now);

  export default {
    name: 'pdfGen',
    props: {
      "expense": {
        "type": Object,
        "required": true
      }
    },
    methods: {
  pdfgen: function () {
        var pdfMake = require('pdfmake/build/pdfmake.js');
        if (pdfMake.vfs == undefined){
          var pdfFonts = require('pdfmake/build/vfs_fonts.js');
          pdfMake.vfs = pdfFonts.pdfMake.vfs;
        }

        var docDefinition = {

          //userPassword: '123',
          ownerPassword: '123456',
          permissions: {
            printing: 'lowResolution',
            modifying: false,
            copying: false,
            annotating: true,
            fillingForms: true,
            contentAccessibility: false,
            documentAssembly: true
          },


          // inhalt des PDFs

          content: [
            {
              text: [
                this.expense.author + '\n',
                'Address\n',
                'PLZ ORT\n',
              ],
              style: 'antragstellender',
              alignment: 'center'
            },
            {
              text: [
                'Viva con Agua de Sankt Pauli e.V.\n',
                'Neuer Kamp 32\n',
                '20357 Hamburg'
              ],
              bold: false
            },
            {
              text: this.$d(new Date(), 'short'),
              style: 'date',
              alignment: 'right'
            },
            {
              text:'Erstattungen von Auslagen:',
              decoration: 'underline',
            },
            {
              text: [
                ' \nCrew: \n',
                'Veranstaltung: '+ this.expense.wherefor +'\n \n',
                'IBAN: __ __ __ __, __ __ __ __, __ __ __ __, __ __ __ __, __ __ __ __, __ __\n\n',
                'Hiermit, bitte ich um Erstattung meiner Auslagen in höhe von gesamt:\n '
              ]
            },
            {
              text:this.expense.amount[0].amount + this.expense.amount[0].currency,
              style: 'auslagen'
            }
          ],
          styles: {
            antragstellender: {
              fontSize: 12,
              bold: true,
              alignment: 'justify',
              margin: [150, 20, 120, 80]
            },
            date: {
              alignment: 'justify',
              margin: [0,120,0,50]
            },
            auslagen: {
              bold: true,
              fontSize: 18,
              background: 'yellow'
            }
          }

        }
        pdfMake.createPdf(docDefinition).download('Erstattungenvon_' + this.expense.wherefor + '_Auslagen.pdf')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>