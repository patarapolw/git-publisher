# eqdict

[![npm version](https://badge.fury.io/js/indent-utils.svg)](https://badge.fury.io/js/indent-utils)

Indented filter utilities, including Showdown extensions / HyperPug filters' maker

## Usage

```typescript
import { createIndentedFilter } from "indented-filter";
const filterFn = createIndentedFilter("x1", (coveredText, attrs) => {
  return customFn(coveredText, attrs)
});
const showdownX1Extension = {
  type: "lang",
  filter: filterFn
};
```

Example matched cases,

```markdown
^^x1 hello
```

```markdown
^^x1(source="github") hello
```

```markdown
![](^^x1(source="github") hello^^)
```

```markdown
^^x1(source="github").
  thank you
    very

  much
```

For more test cases, see [/tests/index.spec.yaml](/tests/index.spec.yaml)

## Usage on the browser

```html
<script src="https://unpkg.com/indent-utils@:version/umd/index.min.js"></script>
<script>
const filterFn = createIndentedFilter("x1", (coveredText, attrs) => {
  return customFn(coveredText, attrs)
})
const showdownX1Extension = {
  type: "lang",
  filter: filterFn
}
</script>
```
