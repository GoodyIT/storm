<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
    class="min-vh"
    >
    <v-card
      class="px-5 py-3"
    >
      <v-card-title>
            Controllers
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              class="mb-3 mr-3"
              single-line
              hide-details
            ></v-text-field>
              <v-btn @click="addValve" color="secondary" dark class="mb-2" ><v-icon size="16" left dark>mdi-plus</v-icon>Add</v-btn>
            <v-dialog v-model="dialog" max-width="720px">
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form
                    ref="form"
                    v-model="valid"
                  >
                      <v-row>
                        <v-col
                          v-if="false"
                          cols="12"
                          md="6"
                        >
                          <v-select
                            :loading="loading"
                            v-model="editItem.username"
                            :items="members"
                            :rules="[rules.required]"
                            attach
                            chips
                            label="Select a member"
                            prepend-icon="mdi-account-outline"
                            required
                          ></v-select>
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-autocomplete
                            v-model="editItem.state"
                            :rules="[rules.required]"
                            :loading="loading"
                            :items="states"
                            class="mb-5"
                            hide-details="auto"
                            label="State"
                            prepend-icon="mdi-google-maps"
                            required
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-autocomplete
                            :disabled="!editItem.state"
                            v-model="editItem.city"
                            :rules="[rules.required]"
                            :loading="loading"
                            :items="cities(editItem.state)"
                            class="mb-5"
                            hide-details="auto"
                            label="City"
                            prepend-icon="mdi-google-maps"
                            required
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model="editItem.desc"
                            :rules="[rules.required]"
                            :loading="loading"
                            class="mb-5"
                            hide-details="auto"
                            label="Description"
                            prepend-icon="mdi-details"
                            required
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            v-model="editItem.site_name"
                            :rules="[rules.required]"
                            :loading="loading"
                            class="mb-5"
                            hide-details="auto"
                            label="Site Name"
                            prepend-icon="mdi-call-merge"
                            required
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            type="number"
                            v-model="editItem.interval"
                            :rules="[rules.required]"
                            :loading="loading"
                            class="mb-5"
                            hide-details="auto"
                            label="Connection interval (min)"
                            prepend-icon="mdi-clock-outline"
                            required
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            type="number"
                            v-model="editItem.open_duration"
                            :rules="[rules.required]"
                            :loading="loading"
                            class="mb-5"
                            hide-details="auto"
                            label="Valve Open Time (min)"
                            prepend-icon="mdi-clock-outline"
                            required
                          />
                        </v-col>
                        <v-col
                          v-if="false"
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            type="number"
                            v-model="editItem.minimum_water_elevation"
                            :rules="[rules.required]"
                            :loading="loading"
                            class="mb-5"
                            hide-details="auto"
                            label="Minimum Water Level Elevation"
                            prepend-icon="mdi-application"
                            required
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        >
                          <v-text-field
                            type="number"
                            v-model="editItem.minimum_elevation"
                            :rules="[rules.required]"
                            :loading="loading"
                            class="mb-5"
                            hide-details="auto"
                            label="Minimum Water Elevation"
                            prepend-icon="mdi-application"
                            required
                          />
                        </v-col>
                      </v-row>
                  </v-form>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="secondary" :loading="loading" text @click="close">Cancel</v-btn>
                      <v-btn color="primary" text :loading="loading" @click="actionController">Save</v-btn>
                    </v-card-actions>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
        </v-card-title>
          <v-data-table
          :loading="loading"
          :headers="headers"
          :items="controllers"
          item-key="id"
          :items-per-page="5"
          :search="search"
          class="custom-alert"
          color="secondary"
          > 
            <template v-slot:item.email="{ item }">
              <span v-html="beautifyEmail(item.email)"></span>
            </template>
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn 
                    text 
                    icon 
                    v-on="on"
                    @click.stop="configureFLS(item)"
                  >
                    <v-icon>mdi-cog</v-icon>
                  </v-btn>
                </template>
                <span>Configure</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn 
                    text 
                    icon 
                    v-on="on"
                    @click.stop="showEditDlg(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn 
                    text 
                    icon 
                    v-on="on"
                    @click.stop="delController(item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Delete</span>
              </v-tooltip>
            </template>
        </v-data-table>
      </v-card>

      <v-snackbar
        v-model="snackbar"
        :color="snackColor  "
        multi-line
        top
      >
        {{snackText}}
        <v-icon
          dark
          @click="snackbar = false"
        >
          mdi-close
        </v-icon>
      </v-snackbar>

      <v-dialog v-model="modal" max-width="290">
          <v-card>
            <v-card-title class="text-center"><b>WARNING</b></v-card-title>
            <v-card-text>Are you sure?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="modal = false">Disagree</v-btn>
              <v-btn color="green darken-1" text @click="_delete()">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

  </v-container>
</template>

<script>
  import stateCities from 'state-cities'
  import { mapActions, mapState } from 'vuex'
  import { beautifyEmail } from '../../util'
  import { deleteController, fetchAllControllers, createController, updateController } from '../../api'
  export default {
    name: 'Root',

    data: () => ({
      valid: true,
      search: '',
      snackbar: false,
      snackColor: '',
      snackText: '',
      dialog: false,
      dateMenu: false,
      modal: false,
      members: [
        'admin',
        'bradcole'
      ],
      statusItems: [
        {text: "Open", value: "opened"},
        {text: "Close", value: "closed"},
        {text: "Partial Open", value: "partial_opened"},
      ],
      eventNames: [
        'BZW - Blizzard Warning',
        'CFA - Coastal Flood Watch',
        'CFW - Coastal Flood Warning',
        'DSW - Dust Storm Warning',
        'EWW - Extreme Wind Warning',
        'FFA - Flash Flood Watch'
      ],
      curItem: null,
      headers: [
        {
         text: 'Site',
         value: 'site_id'
        },
        {
          text: 'Device Id',
          value: 'controller_id'
        },
        {
          text: 'Location',
          value: 'location'
        },
        {
          text: 'Description',
          value: 'desc'
        },
        // {
        //   text: 'Site Name',
        //   value: 'site_name'
        // },
        {
          text: 'Connection Interval (min)',
          value: 'interval'
        },
        {
          text: 'Valve Open Time (min)',
          value: 'open_duration'
        },
        // {
        //   text: 'Current Water Elevation',
        //   value: 'water_elevation'
        // },
        {
          text: 'Minimum Water Elevation',
          value: 'minimum_elevation'
        },
        { text: 'Actions', value: 'action', sortable: false, width: 180, align: 'center' },
      ],
      defaultIndex: -1,
      editItem: {
        connection_interval: 1
      },
      defaultItem: {
      },
      rules: {
        required: value => {
          return !!value || 'This field is required.'
        },
      }
    }),

    mounted () {
      this.getControllers()  
    },

    computed: {
      ...mapState('site', ['controllers', 'loading']),
      formTitle () {
        return this.defaultIndex === -1 ? 'Add Controller' : 'Edit Controller'
      },
      states () {
        return stateCities.getStates()
      },
    },

    methods: {
      ...mapActions('site', ['getControllers', 'updateController']),

      beautifyEmail,

      cities (state) {
        if (state) {
          return stateCities.getCities(state)
        } else {
          return []
        }
      },

      returnToRoot() {
        localStorage.removeItem('custom')
        localStorage.removeItem('site_id')
        this.$router.push({name: 'Users'})
      },

      showSnack (res) {
        this.snackText = res.message
        this.snackColor = res.status
        this.snackbar = true
      },

      close () {
        this.dialog = false
      },

      configureFLS (item) {
        this.$router.push({ path: `/configure/${item.controller_id}`})
      },

      async loadControllers() {
        this.loading = 'secondary'
        const res = await fetchAllControllers()
        this.snackText = res.message
        this.snackColor = res.status
        this.snack = true
        res.data.map(controller => {
          this.items.push({
            ...controller,
            location: controller.city + ', ' +controller.state,
          })
        })
        this.loading = false
      },

      closeDialog () {
        this.dialog = false
        setTimeout(() => {
          this.defaultItem = Object.assign({}, this.defaultItem)
          this.defaultIndex = -1
        }, 300)
      },

      editController (item) {
        const self = this
        this.$dialog.confirm({
          text: 'Do you really want to update the controller?',
          title: 'Warning',
          actions: {
            false: 'No',
            true: {
              color: 'red',
              text: 'Yes',
              handle: () => {
                self._updateController(item)
              }
            }
          }
        })  
      },

      async _updateController(item) {
        this.loading = true
        const res = await updateController(item)
        this.showSnack(res)
        if (res.status == 'success') {
          Object.assign(this.controllers[this.defaultIndex], this.editItem)
        }
        this.loading = false
      },

      showEditDlg (item) {
        this.defaultIndex = this.controllers.indexOf(item)
        this.editItem = Object.assign({}, item)
        this.dialog = true
      },

      addValve () {
        this.defaultIndex = -1
        this.editItem = Object.assign({}, this.defaultItem)
        this.dialog = true
      },

      addController (item) {
        const self = this
        this.$dialog.confirm({
          text: 'Are you sure you want to add a new controller?',
          title: 'Warning',
          actions: {
            false: 'No',
            true: {
              color: 'red',
              text: 'Yes',
              handle: () => {
                self._createController(item)
              }
            }
          }
        })  
      },

      async _createController (item) {
        this.loading = true
        const res = await createController(item)
        item.controller_id = res.controller_id
        this.showSnack(res)
        if (res.status == 'success') {
          this.items.push(res.controller)
        }
        this.loading = false
        this.closeDialog()
      },

      async actionController () {
        this.$refs.form.validate()
        if (!this.valid) {
          return
        }
        const item = Object.assign({}, this.editItem)
        let res = {
          status: 'success' 
        }
        if (this.defaultIndex > -1) {
          this.editController(item)
        } else {
          this.addController(item)
        }
        // 
      },

      delController (item) {
        const self = this
        this.$dialog.confirm({
          text: 'Do you really want to remove this controller?',
          title: 'Warning',
          actions: {
            false: 'No',
            true: {
              color: 'red',
              text: 'Yes',
              handle: () => {
                self._delete(item)
              }
            }
          }
        })  
      },

      async _delete(item) {
        this.loading = true
        const res = await deleteController(item.controller_id)
        if (res.status == 'success') {
          this.items = this.items.filter(_item => _item.controller_id != item.controller_id)
        } 
        this.showSnack(res)
        this.loading = false
      } 
    }
  }
</script>