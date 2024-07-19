<template>
  <div class="edit-document">
    <div ref="ivw-hide"></div>
  </div>
</template>
<script>
export default {
  name: "EditDocument",
  components: {},
  data() {
    return {};
  },
  methods: {
    initTemplate() {
      return new Promise((resolve) => {
        if (this.$route.query.templateCode) {
          const getUrlFromQuery = (query) => {
            return Object.keys(query)
              .reduce((prev, next) => {
                if (query[next]) {
                  return prev + `${next}=${query[next]}&`;
                } else {
                  return prev;
                }
              }, "?")
              .slice(0, -1);
          };
          this.$http
            .get(
              `/pagination${getUrlFromQuery({
                SearchTemplateFlag: 1,
                keyWord: this.$route.query.templateCode,
                ...{
                  options: encodeURIComponent(
                    JSON.stringify({
                      attach_time: -1,
                    })
                  ),
                  pageIndex: 1,
                  pageSize: 1,
                },
              })}`
            )
            .then((res) => {
              if (res && res.data && res.data.data && res.data.data.length > 0) {
                var config;
                try {
                  config =
                    typeof res.data.data[0].default_config_in == "object"
                      ? res.data.data[0].default_config_in
                      : JSON.parse(res.data.data[0].default_config_in);
                } catch {}
                resolve(config || {});
              } else {
                resolve({});
              }
            });
        } else {
          resolve({});
        }
      });
    },
    async initData() {
      let form = document.createElement("form");
      form.action = process.env.VUE_APP_BASE_API + "/api/edit";
      form.target = "_self";
      form.method = "POST";
      // // id
      // let input = document.createElement("input");
      // input.name = "id";
      // input.value = this.$route.query.id;
      // form.append(input);
      // // user
      // input = document.createElement("input");
      // input.name = "user";
      // input.value = this.$route.query.user;
      // form.append(input);

      // document code
      let input = document.createElement("input");
      input.name = "documentCode";
      input.value = decodeURIComponent(this.$route.query.documentCode);
      form.append(input);
      // template code
      input = document.createElement("input");
      input.name = "templateCode";
      input.value = decodeURIComponent(this.$route.query.templateCode);
      form.append(input);
      // user
      input = document.createElement("input");
      input.name = "user";
      input.value = decodeURIComponent(this.$route.query.user);
      form.append(input);
      // tenant id
      input = document.createElement("input");
      input.name = "tenantId";
      input.value = decodeURIComponent(this.$route.query.tenantId);
      form.append(input);
      // user id
      input = document.createElement("input");
      input.name = "userId";
      input.value = decodeURIComponent(this.$route.query.userId);
      form.append(input);
      // view mode
      input = document.createElement("input");
      input.name = "viewMode";
      input.value = decodeURIComponent(this.$route.query.viewMode);
      form.append(input);
      // view defaultValue
      input = document.createElement("input");
      input.name = "defaultValue";
      let templateConfig = await this.initTemplate();
      let defaultValue;
      try {
        defaultValue = JSON.parse(
          decodeURIComponent(this.$route.query.defaultValue)
        );
      } catch {}
      defaultValue = defaultValue || {};
      input.value = JSON.stringify(Object.keys(defaultValue).reduce(
        (prev, next) => {
          let current = Object.keys(templateConfig).reduce((p, n) => {
            if (next == templateConfig[n]) {
              p[n] = defaultValue[next];
            } else {
              p[next] = defaultValue[next];
            }
            return p;
          }, {});
          return {
            ...prev,
            ...current,
          };
        },
        {}
      ));

      console.log('templateConfig')
      console.log(templateConfig)
      console.log('defaultValue')
      console.log(input.value)

      form.append(input);

      this.$refs["ivw-hide"].append(form);
      form.submit();
      form.remove();
    },
  },
  mounted() {
    this.initData();
  },
};
</script>
