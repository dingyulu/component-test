<template>
  <Modal v-bind="$attrs" v-on="$listeners" title="新建模板" ref="Modal" :mask-closable="false" :closable="false">
    <Form
      v-if="currentDocument"
      ref="Form"
      :model="currentDocument"
      :rules="rules"
      :label-width="100"
    >
      <FormItem prop="templateCode" label="模板编号">
        <Input type="text" v-model="currentDocument.templateCode"></Input>
      </FormItem>
      <!-- <FormItem prop="templateCode" label="模板">
        <Input
          type="text"
          v-model="currentDocument.componentId"
        ></Input>
      </FormItem> -->
      <FormItem
        prop="templateFile"
        label="模板文件"
      >
        <ivw-upload
          action="#"
          type="drag"
          :max-size="1024 * 10"
          accept=".xls, .xlsx, .ppt, .pptx, .doc, .docx, .pdf, .csv, .oform, .docxf, ods"
          :format="[
            'xls',
            'xlsx',
            'ppt',
            'pptx',
            'doc',
            'docx',
            'pdf',
            'csv',
            'oform',
            'docxf',
            'ods',
          ]"
          :on-success="onSuccess"
        >
          <div style="padding: 20px 0">
            <Icon class="ivw-light-blue" type="md-grid" size="52"></Icon>
            <p>点击选择或拖拽文件到此处！</p>
          </div>
        </ivw-upload>
      </FormItem>
    </Form>
    <template #footer>
      <Button @click="onCancel">取消</Button>
      <Button type="primary" :loading="loading" @click="onConfirm">确定</Button>
    </template>
  </Modal>
</template>
<script>
export default {
  name: "AddTemplate",
  props: {
    document: {
      type: Object,
      default: () => ({
        documentCode: null,
        templateFile: null,
        templateCode: null,
      }),
    },
  },
  components: {
    "ivw-upload": () => import("@/components/ivw-upload"),
  },
  data() {
    return {
      loading: false,
      currentDocument: null,
      rules: {
        documentCode: [
          { required: true, message: "请输入文档编号", trigger: "blur" },
        ],
        templateFile: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!this.currentDocument.templateFile) {
                callback(new Error("请选择模板文档"));
                return;
              }
              callback();
            },
          },
        ],
        templateCode: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!this.currentDocument.templateCode) {
                callback(new Error("请选择模板"));
                return;
              }
              callback();
            },
          },
        ],
      },

      templateList: [],
    };
  },
  watch: {},
  methods: {
    initWatch() {
      this.$watch(
        () => {
          return this.$refs.Modal.value;
        },
        () => {
          if (this.$refs.Modal.value) {
            // visible
            this.currentDocument = JSON.parse(JSON.stringify(this.document));
          } else {
            // hide
            this.currentDocument = null;
          }
        },
        {
          deep: true,
        }
      );
    },
    onSuccess(file) {
      this.currentDocument.templateFile = file;
    },
    onCancel() {
      this.$emit("update:value", false);
    },
    onConfirm() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          let formData = new FormData();
          formData.append("tenantId", this.$store.state.user.tenantId);
          formData.append("userId", this.$store.state.user.userId);
          formData.append("user", this.$store.state.user.user_name);

          formData.append("documentCode", this.currentDocument.documentCode);
          formData.append("file", this.currentDocument.templateFile);
          formData.append("templateCode", this.currentDocument.templateCode);
          this.$http.get(`/templateCode/count?code=${this.currentDocument.templateCode}`).then(res => {
            if (res && res.data && res.data.code == '0') {
              this.$http
                .post("/upload", formData, {
                  "Content-Type": "multipart/form-data",
                })
                .then((res) => {
                  this.$emit("update:value", false);
                  this.$emit("update:document", this.currentDocument);
                  this.$emit("success");
                  this.$Message.success("新建成功");
                })
                .catch((err) => {
                  this.$Message.error("新建失败!");
                })
            } else if (res && res.data && res.data.code == '2001') {
              this.$Message.error('模板编号已存在!')
            } else {
              this.$Message.error('新建失败!')
            }
          })
        } else {
          // this.$Message.error("验证失败!")
        }
      });
    },
  },
  mounted() {
    this.initWatch();
  },
};
</script>
<style lang="scss" scoped>
</style>
