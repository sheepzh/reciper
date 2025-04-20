# Recipe Code

A universal Schema for cooking recipes.

## Overview

SOR is an open-standard schema for describing cooking recipes in a structured, machine-readable format.

## Features

* Standardized format for consistent recipe representation

* Multi-cuisine support adaptable to any cooking style

* Detailed ingredient modeling with quantities, alternatives, and preparation methods

* Step-by-step instructions with timing and equipment requirements

## Basic Structure

### Kitchenware

### Material

```yaml
id: cooking_oil
cate: material
name: Blanched Choy Sum
measurement: weight volume
```

```yaml
id: garlic
cate: vegetable
name: Garlic
procedure:
    - mince
```

### Recipe

```yaml
id: blanched_choy_sum
name: Blanched Choy Sum
desc: foobar
kitchenware:
    - use: k#pot
materials:
    - use: m#choy_sum 250g
    - use: m#cooking_oil
pre:
    - cut: m#choy_sum
      remark:
        remove: old parts
    - mince: m#garlic
    - mix: 
      with:
        
steps:
    
```

## Roadmap

* Dietary classifications (vegan, gluten-free, etc.)

* Multilingual support