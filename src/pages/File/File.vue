<template lang="pug">
.container(style="margin-top: 1em")
  .columns
    .column.is-3
      b-menu
        b-menu-list
          template(slot="label")
            span(style="margin-right: 1em") Directory:
            span(v-html="relativePathHtml")
          b-menu-item(
            v-if="dree.relativePath !== '.'"
            icon="folder-outline"
            label="..",
            @click="upOneLevel"
          )
          b-menu-item(
            tag="a"
            v-for="d in dree.children || []"
            :icon="d.type === 'directory' ? 'folder' : 'file-outline'"
            :label="d.name"
            :key="d.name"
            :active="d.active"
            @click="onItemClicked(d)"
          )
        b-menu-list(label="About")
          b-menu-item(icon="github-circle" label="GitHub" v-if="githubUrl" tag="a" :href="githubUrl")
    .column
      .card
        iframe#iframe-reveal(v-if="type === 'reveal'" :src="revealUrl" frameborder="0")
        .card-content.content(v-else v-html="html" ref="content" id="content")
      div(v-if="disqus")
        vue-disqus(:shortname="disqus" :identifier="filePath")
      div(v-else)
        div(ref="comment")
</template>

<script src="./index.ts" lang="ts"></script>
<style src="./index.scss" lang="scss"></style>
