<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <main>
        <Table :columns="columns1" :data="data1"></Table>
    </main>
    <Tag> <router-link to="/">返回主页</router-link></Tag>
    <Icon type="ios-alert-outline" /><Icon type="md-git-pull-request" /><Icon type="ios-globe" /><Icon type="md-infinite" />
    <Steps :current="1">
      <Step title="已完成" content="这里是该步骤的描述信息"></Step>
      <Step title="进行中" content="这里是该步骤的描述信息"></Step>
      <Step title="待进行" content="这里是该步骤的描述信息"></Step>
      <Step title="待进行" content="这里是该步骤的描述信息"></Step>
    </Steps>
    <Card title="Options" icon="ios-options" :padding="0" shadow style="width: 300px;">
      <CellGroup>
        <Cell title="Only show titles" />
        <Cell title="Display label content" label="label content" />
        <Cell title="Display right content" extra="details" />
        <Cell title="Link" extra="details" to="/components/button" />
        <Cell title="Open link in new window" to="/components/button" target="_blank" />
        <Cell title="Disabled" disabled />
        <Cell title="Selected" selected />
        <Cell title="With Badge" to="/components/badge">
          <Badge :count="10" slot="extra" />
        </Cell>
        <Cell title="With Switch">
          <Switch v-model="switchValue" slot="extra" />
        </Cell>
      </CellGroup>
      <Dropdown style="margin-left: 20px">
        <Button type="primary">
          下拉菜单
          <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem>驴打滚</DropdownItem>
          <DropdownItem>炸酱面</DropdownItem>
          <DropdownItem disabled>豆汁儿</DropdownItem>
          <DropdownItem>冰糖葫芦</DropdownItem>
          <DropdownItem divided>北京烤鸭</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Card>
    <Row>
      <Col span="12">
        <DatePicker type="date" placeholder="Select date" style="width: 200px"></DatePicker>
      </Col>
      <Col span="12">
        <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
      </Col>
    </Row>
    <Alert>
      An info prompt
      <template slot="desc">Content of prompt. Content of prompt. Content of prompt. Content of prompt. </template>
    </Alert>
    <Alert type="success">
      A success prompt
      <template slot="desc">Content of prompt. Content of prompt. Content of prompt. Content of prompt. </template>
    </Alert>
    <Alert type="warning">
      A warning prompt
      <template slot="desc">
        Content of prompt. Content of prompt. Content of prompt.
      </template>
    </Alert>
    <Alert type="error">
      An error prompt
      <span slot="desc">
            Custom error description copywriting. <Icon type="help-circled" size="14"></Icon>
        </span>
    </Alert>
    <Timeline>
      <TimelineItem>
        <p class="time">1976年</p>
        <p class="content">Apple I 问世</p>
      </TimelineItem>
      <TimelineItem>
        <p class="time">1984年</p>
        <p class="content">发布 Macintosh</p>
      </TimelineItem>
      <TimelineItem>
        <p class="time">2007年</p>
        <p class="content">发布 iPhone</p>
      </TimelineItem>
      <TimelineItem>
        <p class="time">2010年</p>
        <p class="content">发布 iPad</p>
      </TimelineItem>
      <TimelineItem>
        <p class="time">2011年10月5日</p>
        <p class="content">史蒂夫·乔布斯去世</p>
      </TimelineItem>
    </Timeline>
    <Circle :percent="80">
      <span class="demo-Circle-inner" style="font-size:24px">80%</span>
    </Circle>
    <Circle :percent="100" stroke-color="#5cb85c">
      <Icon type="ios-checkmark" size="60" style="color:#5cb85c"></Icon>
    </Circle>
    <Circle :percent="35" stroke-color="#ff5500">
        <span class="demo-Circle-inner">
            <Icon type="ios-close" size="50" style="color:#ff5500"></Icon>
        </span>
    </Circle>
    <Poptip trigger="hover" title="Title" content="content">
      <Button>Hover</Button>
    </Poptip>
    <Poptip title="Title" content="content">
      <Button>Click</Button>
    </Poptip>
    <Poptip trigger="focus" title="Title" content="content">
      <Button>Focus</Button>
    </Poptip>
    <Poptip trigger="focus" title="Title" content="content">
      <Input placeholder="Input focus" />
    </Poptip>
    <BackTop></BackTop>
  </div>
</template>

<script>
  export default {
    name: 'landing-page',
      data () {
          return {
              switchValue:true,
              columns1: [
                  {
                      title: 'Name',
                      key: 'name'
                  },
                  {
                      title: 'Age',
                      key: 'age'
                  },
                  {
                      title: 'Address',
                      key: 'address'
                  }
              ],
              data1: [
                  {
                      name: 'John Brown',
                      age: 18,
                      address: 'New York No. 1 Lake Park',
                      date: '2016-10-03'
                  },
                  {
                      name: 'Jim Green',
                      age: 24,
                      address: 'London No. 1 Lake Park',
                      date: '2016-10-01'
                  },
                  {
                      name: 'Joe Black',
                      age: 30,
                      address: 'Sydney No. 1 Lake Park',
                      date: '2016-10-02'
                  },
                  {
                      name: 'Jon Snow',
                      age: 26,
                      address: 'Ottawa No. 2 Lake Park',
                      date: '2016-10-04'
                  }
              ]
          }
      },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
    #logo {
      height: 20px;
      margin-bottom: 20px;
      width: 50px;
    }
  }




</style>
