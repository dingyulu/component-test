<template>
  <Upload ref="ivw-upload"
          :format="format"
          :accept="accept"
          :maxSize="maxSize"
          :type="type"
          :on-success="onSuccess"
          action="#">
    <template>
      <slot></slot>
    </template>
  </Upload>
</template>

<script>

/** 基于 iview Upload 组件修改，将 ajax 修改为 axios 以支持 vue-cli 配置 反向代理
 同时，继承 ivew Upload ui 效果
 */
export default {
  name: 'ivw-upload',
  props: {
    action: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: 'file'
    },
    data: {
      type: Object
    },
    // accept=".xls, .xlsx, .ppt, .pptx, .doc, .docx, .pdf, .png, .gif, .jpg, .jpeg, .gz, .tar.z, .zip, .rar, .7z"
    // format="['xls', 'xlsx', 'ppt', 'pptx', 'doc', 'docx', 'pdf', 'png', 'gif', 'jpg', 'jpeg', 'gz', 'tar.z', 'zip', 'rar', '7z']"
    format: {
      type: Array,
      default() {
        return [];
      }
    },
    accept: {
      type: String
    },
    maxSize: {
      type: Number
    },
    type: {
      type: String
    },
    onSuccess: {
      type: Function,
      default() {
        return {};
      }
    }
  },
  mounted() {
    // console.log(this.$refs['ivw-upload']);
    const _t = this;
    this.$refs['ivw-upload'].post = function (file) {
      // check format
      if (this.format.length) {
        const _file_format = file.name.split('.').pop().toLocaleLowerCase();
        const checked = this.format.some(item => item.toLocaleLowerCase() === _file_format);
        if (!checked) {
          _t.$Message.error("文件格式不支持！：" + _file_format);
          this.onFormatError(file, this.fileList);
          return false;
        }
      }

      // check maxSize
      if (this.maxSize) {
        if (file.size > this.maxSize * 1024) {
          this.onExceededSize(file, this.fileList);
          _t.$Message.error("文件大于 10M！");
          return false;
        }
      }

      this.handleStart(file);
      let formData = new FormData();
      formData.append(this.name, file);

      if (_t.data) {
        for (let k in _t.data) {
          formData.append(k, _t.data[k]);
        }
      }

      this.handleSuccess({}, file);

      _t.onSuccess && _t.onSuccess(file)

      // _t.$http.post(_t.action, formData, {
      //   'Content-Type': 'multipart/form-data'
      // }).then(res => {
      //   this.handleSuccess(res, file);
      // }).catch(err => {
      //   this.handleError(err, null, file);
      // });

      // ajax({
      //   headers: this.headers,
      //   withCredentials: this.withCredentials,
      //   file: file,
      //   data: this.data,
      //   filename: this.name,
      //   action: this.action,
      //   onProgress: e => {
      //     this.handleProgress(e, file);
      //   },
      //   onSuccess: res => {
      //     this.handleSuccess(res, file);
      //   },
      //   onError: (err, response) => {
      //     this.handleError(err, response, file);
      //   }
      // });
    };
  },
  methods: {}
};
</script>

<style scoped>

</style>
