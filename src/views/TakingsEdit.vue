<template>
    <VcAFrame :title="headerTitle" hasContainer="true">
        <el-form
          :model="taking"
          :rules="rules"
          class="columns-container">
          <VcAColumn size="60%">
                <el-card class="box-card">
                    <TakingContext v-model="taking.context" v-bind:context="taking.context" />
                </el-card>  
                <el-card class="box-card tail expand" v-if="employee || admin"> 
                    <el-form-item class="vca-form" :label="$t('utils.crewSelect.label')" :required="true" prop="crew">
                        <CrewSelect v-model="taking.crew" @crew="selectCrew"/>
                    </el-form-item>
                </el-card/>
                <el-card class="box-card tail expand">
                    <TakingCalculator :first="false" :sourceCount="sourceCount" v-model="taking.amount" v-bind:amount="taking.amount" />
                </el-card>

                <el-card v-if="showExternalTransactions" class="box-card tail expand">
                    <ExternalTransactionDetails v-model="taking.details" :taking="taking" :sources="taking.amount.sources" :name="taking.context.description" />
                </el-card>

                <el-card class="box-card tail expand">
                    <el-form-item :label="$t('donation.placeholder.comment')" class="vca-categories">
                        <el-input
                            type="textarea"
                            :rows="4"
                            :placeholder="$t('takings.placeholder.comment')"
                            v-model="taking.comment">
                        </el-input>
                    </el-form-item>
                </el-card>

                <el-card v-if="showInternalTransactions" class="box-card tail expand">
                    <TakingDeadline :received="taking.amount.received" /><br/><br/>
                    <div><span>{{ $t("donation.placeholder.internalDetails.description") }}</span></div><br/>
                    <ReasonForPayment v-on:addReason="addReason" :taking="taking" :name="taking.context.description"/>
                </el-card>

                <button
                    v-if="!updateMode"
                    :disabled="!validInput"
                    class="vca-button-primary vca-full-width"
                    @click.prevent="submitForm">
                        {{ $t("takings.buttons.save") }}
                </button>
                <button
                    v-if="updateMode"
                    :disabled="!validInput"
                    class="vca-button-primary vca-full-width"
                    @click.prevent="updateForm">
                        {{ $t("takings.buttons.update") }}
                </button>

                <el-popover
                    v-if="!updateMode && (!validInput || !validPartner)"
                    placement="top"
                    width="350"
                    v-model="visible">
                        <p><strong>{{ $t("takings.popover.title") }}</strong></p>
                        <div v-if="!validDescription">{{ $t("takings.popover.errors.description") }}</div>
                        <div v-if="!validCategory">{{ $t("takings.popover.errors.category") }}</div>
                        <div v-if="!validSource || !validSourceData">{{ $t("takings.popover.errors.amount") }}</div>
                        <div v-if="!validPartner">{{ $t("takings.popover.errors.partner") }}</div>
                        <el-button type="text" slot="reference">{{ $t("takings.popover.buttonText") }}</el-button>
                </el-popover>
            </VcAColumn>
        </el-form>
    </VcAFrame>
</template>

<script>
    import axios from 'axios'
    import { mapGetters, mapActions } from 'vuex'
    import { VcAFrame, VcAColumn } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import { Input, Form, Card} from 'element-ui'
    import TakingCalculator from '@/components/takings/edit/TakingCalculator.vue'
    import ExternalTransactionDetails from '@/components/ExternalTransactionDetails.vue'
    import ReasonForPayment from '@/components/ReasonForPayment.vue'
    import TakingDeadline from '@/components/takings/edit/TakingDeadline.vue'
    import TakingContext from '@/components/takings/edit/TakingContext.vue'
    import CrewSelect from '@/components/utils/CrewSelect.vue'

    export default {
        name: "TakingsEdit",
        components: {
            'TakingCalculator': TakingCalculator,
            'ExternalTransactionDetails': ExternalTransactionDetails,
            'ReasonForPayment': ReasonForPayment,
            'TakingDeadline': TakingDeadline,
            'TakingContext': TakingContext,
            'VcAFrame': VcAFrame,
            'VcAColumn': VcAColumn,
            'el-card': Card,
            'el-input': Input,
            'el-form': Form,
            'CrewSelect': CrewSelect
        },
        props: {
            id: {
                type: String,
                default: null
            }
        },
        data () {
            return {
                reason: "",
                visible: false,
                sourceCount: 0,
                crewSelect: this.crew,
                taking: {
                    "context": {
                        "description": "",
                        "category": ""
                    },
                    "comment": "",
                    "details": {
                        "reasonForPayment": "",
                        "receipt": false,
                        "partner": {}
                    },
                    "description": "",
                    "crew": [ this.crew ],
                    "amount": {
                        "received": Date.now(),
                        "sources": [],
                        "involvedSupporter": []
                    },
                    "created": Date.now(),
                    "updated": Date.now(),
                },
                rules: {
                    crew: [
                        { required: true, message: this.$t('utils.crewSelect.validate'), trigger: 'change' }
                    ],
                    context: [{
                        required: true
                    }],
                    comment: [{
                        required: true
                    }],
                    amount: [{
                        required: true
                    }],

                }
            }
        },
        mounted () {
            if (this.id !== null) {
                axios.get(
                  '/backend/stream/takings/id/' + this.id,
                  { 'headers': { 'X-Requested-With': 'XMLHttpRequest' }}
                  )
                .then(response => {
                  if(response.status === 200) {
                    this.taking = response.data
                    this.sourceCount = this.taking.amount.sources.length
                }
            })
                .catch(error => { 
                    console.log(error.response.status)
                    switch(error.response.status) {
                        case 401:
                        this.open401()
                        this.$router.push('/takings')
                        break;
                    }
                })
            }
        },
        computed: {
            ...mapGetters('user', {
                user: 'get',
                crew: 'getCrew',
                employee: 'isEmployee',
                admin: 'isAdmin'
            }),
            headerTitle () {
              if (this.id !== null) {
                    return this.$t('takingsEdit.header.edit')
                } else {
                    return this.$t('takingsEdit.header.add')
                }
            },
            showExternalTransactions () {
                return this.taking.amount.sources.filter(s => s.typeOfSource.category === "extern").length > 0
            },
            showInternalTransactions () {
                return this.taking.amount.sources.filter(s => s.typeOfSource.category === "cash").length > 0
            },
            showCalculator () {
                return this.taking.context.hasOwnProperty("category") && this.taking.context.category !== "" &&
                this.taking.context.hasOwnProperty("description") && this.taking.context.description !== "" 
            },
            updateMode () {
                return this.id !== null
            },
            validSource () {
                return this.showInternalTransactions || this.showExternalTransactions
            },
            validCategory () {
                return this.taking.context.category !== ""
            },
            validDescription() {
                return this.taking.context.description !== ""
            },
            validPartner() {
                for (var source in this.taking.amount.sources) {
                    if (this.taking.amount.sources[source].typeOfSource.category == "extern") {
                        return (this.taking.details.partner.hasOwnProperty("name") && this.taking.details.partner.name !== "") &&
                            (this.taking.details.partner.hasOwnProperty("asp") && this.taking.details.partner.asp !== "") &&
                            (this.taking.details.partner.hasOwnProperty("email") && this.taking.details.partner.email !== "") &&
                            (this.taking.details.partner.hasOwnProperty("address") && this.taking.details.partner.address !== "")
                    }
                }
                return true;
            },
            validSourceData () {
                function validateSource(source) {
                    return source.amount.hasOwnProperty("amount") && source.amount.amount > 0 &&
                    source.hasOwnProperty("typeOfSource") && source.typeOfSource !== ""
                }
                return this.taking.amount.sources.length > 0 &&  this.taking.created !== "" && this.taking.amount.involvedSupporter !== "" && this.taking.amount.sources.every(validateSource)
            },
            validInput() {
                return this.validSource && this.validCategory && this.validDescription && this.validSourceData && this.validPartner
            }
        },
        methods: {
            ...mapActions('takings', [
                'add', // -> this.foo()
                'update',
                'getById',
            ]),
            addReason(reason) {
                this.reason = reason
            },
            submitForm () {
                if(this.taking.amount.sources.length > 0) {
                    for (var source in this.taking.amount.sources) {
                        if (this.taking.amount.sources[source].typeOfSource.category == "extern") {
                            this.taking.amount.sources[source].typeOfSource.external = {
                                "location": this.taking.details.partner.name,
                                "contactPerson": this.taking.details.partner.asp,
                                "email": this.taking.details.partner.email,
                                "address": this.taking.details.partner.address,
                                "receipt": this.taking.details.receipt,
                            }
                        }
                    }
                }
                this.taking.details.reasonForPayment = this.reason
                // copied from store
                var user = this.user
                var supporter = []
                supporter.push({"uuid": this.user.uuid, "name": this.user.name})
            //    for (var i=0; i < this.taking.amount.involvedSupporter.length; i++ ) {
            //        var entry = { 
            //            "uuid": this.taking.amount.involvedSupporter[i].id, 
            //            "name": this.taking.amount.involvedSupporter[i].profiles[0].supporter.fullName
            //        }
            //        supporter.push(entry)
            //    }
                this.taking["author"] = user.uuid
                //taking["norms"] = "Donation"
             //   this.taking.crew = this.crew
                this.taking.amount.involvedSupporter = supporter
                this.taking["depositUnits"] = []
                axios.post(
                    '/backend/stream/takings/create',
                    this.taking,
                    { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
                )
                    .then(response => this.$router.push('/takings'))
                .catch(error => 
                    this.open504()
                )
            },
            updateForm () {
                if(this.taking.amount.sources.length > 0) {
                    for (var source in this.taking.amount.sources) {
                        if (this.taking.amount.sources[source].typeOfSource.category == "extern") {
                            this.taking.amount.sources[source].typeOfSource.external = {
                                "location": this.taking.details.partner.name,
                                "contactPerson": this.taking.details.partner.asp,
                                "email": this.taking.details.partner.email,
                                "address": this.taking.details.partner.address,
                                "receipt": this.taking.details.receipt,
                            }
                        }
                    }
                }
                axios.post(
                    '/backend/stream/takings/update',
                    this.taking,
                    { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
                )
                    .then(response => this.$router.push('/takings'))
                .catch(error => 
                    this.open504()
                )

            },
            selectCrew(value) {
                console.log(value)
                this.taking.crew = [ value ]
            },
            open504() {
                this.$notify({
                    title: this.$t('errors.ajax.badRequest.header'),
                    message: this.$t('errors.ajax.badRequest.msg'),
                    type: 'warning'
                })
            },
            open401() {
                this.$notify({
                    title: this.$t('errors.ajax.forbidden.header'),
                    message: this.$t('errors.ajax.forbidden.msg'),
                    type: 'warning'
                })
            },
            open(title, message, type) {
                Notification({
                    title:  title,
                    message: message,
                    type: type
                });
            }
        }
    }
</script>

<style scoped>
    .box-card {
        width: 100%;
    }
    .box-card.tail {
        margin-top: 2em;
    }
    .box-card.expand {
        flex-grow: 1;
    }
</style>


