<template>
  <el-dialog 
    :visible="visible"
    :show-close="false"
    :close-on-click-modal="false"
    width="30%"
    @close="$emit('close')"
    id="modal"
  >

    <template slot="title">
      <el-row type="flex" justify="center">
        <h4 v-if="isFirstAddition">Сохранить запрос</h4>
        <h4 v-else>Изменить запрос</h4>
      </el-row>
    </template>

    <el-row type="flex" justify="center">
      <el-col :span="20">

        <el-form label-position="top" ref="form" :model="localFavorite" v-if="lodash.size(localFavorite)">
          <el-form-item label="Запрос" prop="query" :rules="rules.query">
            <el-input 
              :rules="rules.query"
              :disabled="isFirstAddition"
              placeholder="Введите запрос" 
              v-model="localFavorite.query"
            />
          </el-form-item>
          <el-form-item label="Название" prop="name" :rules="rules.name"> 
            <el-input placeholder="Введите название" v-model="localFavorite.name"/>
          </el-form-item>
          <el-form-item label="Сортировать по">
            <el-select v-model="localFavorite.filter" placeholder="Без сортировки">
              <el-option 
                v-for="(filterName, filterKey) of filters"
                :key="filterKey"
                :label="filterName" 
                :value="filterKey"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Максимальное количество">
            <el-slider
              :value="+localFavorite.maxLimit"
              @input="localFavorite.maxLimit = $event.toString()"
              :min="0"
              :max="50"
              show-input
            />
          </el-form-item>
        </el-form>

        <el-row type="flex" justify="center" class="undoButton">
          <el-button 
            type="primary" 
            style="padding: 12px 50px;margin: 15px"
            @click="$emit('close')"
            :loading="isLoad"
            plain
            v-text="isFirstAddition ? 'Не сохранять' : 'Не изменять'"
          />
        </el-row>
        <el-row type="flex" justify="center" class="saveButton">
          <el-button 
            type="primary" 
            style="padding: 12px 50px;margin: 15px"
            :disabled="!isEdit || !isValid"
            @click="save()"
            :loading="isLoad"
            v-text="isFirstAddition ? 'Сохранить' : 'Изменить'"
          />
        </el-row>

      </el-col>
    </el-row>

  </el-dialog>
</template>

<script>
import _ from 'lodash';
import { mapActions } from 'vuex';

export default {
  name: 'EditFavoriteModal',

  props: {
    userId: String,
    visible: Boolean,
    favorite: Object,
    isFirstAddition: Boolean,
  },

  data: () => ({
    lodash: _,
    localFavorite: {},
    isEdit: false,
    isLoad: false,
    isValid: false,
    filters: {
      date: 'Дате загрузки',
      rating: 'Рейтингу',
      relevance: 'Релевантности',
      title: 'Названию',
      videoCount: 'Длительности видео',
      viewCount: 'Числу просмотров',
    },
    rules: {
      maxLimit: [],
      filter: [],
      query: [{ min: 1, max: 100, message: 'Длина не должна быть меньше 1', trigger: 'blur' }],
      name: [
        { required: true, message: 'Введите название', trigger: 'blur' },
        { min: 1, max: 100, message: 'Длина не должна быть меньше 1', trigger: 'blur' }
      ],
    },
  }),

  watch: {
    localFavorite: {
      deep: true,
      // immediate: true,
      handler() {
        if(this.$refs.form) {
          this.$refs.form.validate(valid => this.isValid = valid);
        } 
        this.isEdit = !this.isFirstAddition
          ? !_.isEqual(this.localFavorite, this.favorite)
          : true;
      },
    },
    favorite: {
      deep: true,
      immediate: true,
      handler() {
        this.isLoad = false;
        if(!this.favorite) return;
        this.localFavorite = _.cloneDeep(this.favorite);
      },
    },
  },

  methods: {
    ...mapActions(['updateFavorite', 'addFavoriteToDB']),
    async save() {
      this.isLoad = true;

      if(this.isFirstAddition) {
        await this.addFavoriteToDB({
          userId: this.userId,
          ...this.localFavorite
        })
      } else {
        await this.updateFavorite({ 
          new: this.localFavorite,
          old: this.favorite,
        });
      }
      this.isLoad = false;
      this.$emit('close');
    },
  },
};
</script>

<style>
#modal .el-form-item__label {
  line-height: 26px !important;
  padding: 0 !important;
}

#modal .el-dialog__body {
  padding-top: 0 !important;
}

#modal .el-select {
  width: 100% !important;
}

#modal .undoButton button,
#modal .saveButton button {
  margin: 5px 0 !important;
  width: 100%;
}
</style>