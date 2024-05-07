<template>
  <span class="font-2-header text-transparent bg-clip-text bg-gradient-1">
    CAROUSEL
  </span>
  <div class="flex flex-col gap-4 p-4 bg-neutral-150 border-dashed border-2 border-color-1 rounded-lg">
    <div class="font-2-header text-transparent bg-clip-text bg-gradient-1">
      Default
    </div>
    <div class="p-4 bg-neutral-150 border-dashed border-2 border-color-1 rounded-lg">
      <carousel
        title="How it works in a few steps for example with"
        subtitle="Take a look at how it works from the customer's perspective and how you can benefit from our Platform."
        color="BLUE"
        :slide-list="cardList"
        type="DEFAULT"
        button-text="Read more"
        accent-word="Accent word"
        @button-click="onClick"
      />
    </div>
    <div class="font-2-header text-transparent bg-clip-text bg-gradient-1">
      Images
    </div>
    <div class="p-4 bg-neutral-150 border-dashed border-2 border-color-1 rounded-lg">
      <carousel
        title="How it works in a few steps for example with"
        subtitle="Take a look at how AiO works from the customer's perspective and how you can benefit from our Platform."
        color="BLUE"
        :slide-list="cardList"
        type="IMAGES"
        button-text="Read more"
        accent-word="Accent word"
        @button-click="onClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Carousel from './carousel.vue';
import CarouselPlaceholder from '@/assets/images/carousel-image-placeholder.png?url';

const cardList = [
  {
    id: '0',
    img: {
      src: CarouselPlaceholder,
      alt: '',
    },
    title: 'Step 1',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna',
  },
  {
    id: '1',
    img: {
      src: CarouselPlaceholder,
      alt: '',
    },
    title: 'Step 2',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magn',
  },
  {
    id: '2',
    img: {
      src: CarouselPlaceholder,
      alt: '',
    },
    title: 'Step 3',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magn',
  },
  {
    id: '3',
    img: {
      src: CarouselPlaceholder,
      alt: '',
    },
    title: 'Step 4',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magn',
  },
  {
    id: '4',
    img: {
      src: CarouselPlaceholder,
      alt: '',
    },
    title: 'Step 5',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magn',
  },
  {
    id: '5',
    img: {
      src: CarouselPlaceholder,
      alt: '',
    },
    title: 'Step 6',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magn',
  },
];

function onClick() {
  // eslint-disable-next-line no-alert
  alert("Los Angeles' full name is \"El Pueblo de Nuestra Senora la Reina de los Angeles de Porciuncula\"");
}
</script>
