<template>
  <div
    ref="containerElementRef"
    class="relative w-full h-[728px] bg-neutral-900 rounded-[30px] overflow-hidden p-6 pt-14 sm:p-[64px]"
    :class="{
      'sm:h-[648px]': type === 'DEFAULT',
      'sm:h-[798px]': type === 'IMAGES',
    }"
  >
    <div
      class="absolute bottom-[60px] left-2/4 -translate-x-2/4 z-0 bg-center bg-cover w-[480px] h-[480px]"
      :style="{
        'background-image': `url(${CarouselGlow})`,
      }"
    />
    <div class="w-full flex flex-col items-center gap-3">
      <div class="font-2-header text-neutral-100 text-center">
        {{ title }}
        <span
          :class="{
            'text-transparent bg-clip-text bg-gradient-1 group-hover:text-color-1':
              color === 'BLUE',
            'text-transparent bg-clip-text bg-gradient-2 group-hover:text-color-3':
              color === 'VIOLET',
            'text-transparent bg-clip-text bg-gradient-3 group-hover:text-color-4':
              color === 'ORANGE',
          }"
        >
          {{ accentWord }}
        </span>
      </div>
      <div
        class="max-w-[692px] max-h-12 overflow-hidden font-4 text-neutral-100 text-center opacity-75"
      >
        {{ subtitle }}
      </div>
      <button-small
        v-if="buttonText"
        :color="color"
        :icon="ArrowForwardIcon"
        :text="buttonText"
        @click="onButtonClick"
      />
    </div>
    <div
      class="sm:block hidden absolute z-20 bottom-0 left-0 lg:w-48 w-24 h-full bg-gradient-to-l from-transparent to-neutral-900"
    />
    <div
      class="sm:block hidden absolute z-20 bottom-0 right-0 lg:w-48 w-24 h-full bg-gradient-to-r from-transparent to-neutral-900"
    />
    <!-- CARDS CONTAINER -->
    <div
      v-show="isReady"
      ref="innerElementRef"
      class="absolute z-10 bottom-24 whitespace-nowrap sm:-left-[1096px] -left-[652px] will-change-auto transform-gpu"
      :class="{
        'transition-transform duration-500 ease-in-out': isTransitioning,
      }"
    >
      <div
        v-for="slide in slideList"
        :key="slide.id"
        class="sm:w-[548px] w-[326px] inline-flex items-end mr-10 will-change-transform transform-gpu"
        :class="{
          'h-[280px]': type === 'DEFAULT',
          'h-[438px]': type === 'IMAGES',
        }"
      >
        <div
          :class="{
            'flex flex-col items-center justify-end relative': type === 'IMAGES',
          }"
        >
          <img
            v-if="type === 'IMAGES'"
            class="h-[170px] sm:h-80 w-auto -mb-[50px] sm:-mb-[150px] z-10 object-contain object-center"
            :src="slide.crsl_asset!.permalink"
            :alt="slide.crsl_title"
          >
          <div
            class="rounded-[20px] flex flex-col items-center justify-center bg-neutral-100-20 p-10 pt-[100px]"
            :class="{
              'sm:pt-[80px] h-[248px]': type === 'DEFAULT',
              'sm:pt-[50px] sm:pb-10 sm:px-[34.5px] h-[248px] sm:h-[308px]': type === 'IMAGES',
            }"
          >
            <div
              class="w-full whitespace-normal text-center font-4-header text-neutral-100 opacity-75 mt-auto"
            >
              {{ slide.crsl_title }}
            </div>
            <div
              class="w-full overflow-hidden whitespace-normal text-center font-4 sm:font-3-quote text-neutral-100"
            >
              {{ slide.crsl_description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CARDS CONTAINER ENDS -->
    <!-- NAVIGATION -->
    <div class="absolute bottom-11 left-2/4 z-30 -translate-x-2/4 flex flex-row gap-4">
      <span
        v-for="(navItem, index) in slidesLength"
        :key="index"
        class="block w-[14px] h-[14px] rounded-full bg-neutral-100-20 cursor-pointer"
        :class="{
          'bg-gradient-1': index === currentSlideIndex && color === 'BLUE',
          'bg-gradient-2': index === currentSlideIndex && color === 'VIOLET',
          'bg-gradient-3': index === currentSlideIndex && color === 'ORANGE',
        }"
        @click="navigateToCard(index)"
      />
      <!--@click="navigateToCard(index)"-->
    </div>

    <button-icon
      v-for="button, index in 2"
      :key="index"
      class="
        sm:flex
        absolute
        z-20
        hidden
        "
      :class="{
        'bottom-[218px]' : type === 'DEFAULT',
        'bottom-[302px]' : type === 'IMAGES',
        'left-6': index === 0,
        'right-6': index === 1,
      }"
      background
      :icon="index === 0 ? prevIconComputed : nextIconComputed"
      big-icon
      gradient
      :color="color"
      @click="index === 0 ? prev() : next()"
    />
    <!-- NAVIGATION ENDS -->
  </div>
</template>

<script lang="ts" setup>
import {
  onMounted, ref, watch, computed,
} from 'vue';

import {
  useElementSize, useWindowSize, useSwipe,
} from '@vueuse/core';
import {
  useDebounceFn,
} from '@vueuse/shared';

import ButtonSmall from '@/components/button-small/button-small.vue';
import ButtonIcon from '@/components/button-icon/button-icon.vue';

import ArrowForwardIcon from '@/assets/icons/arrow-forward.svg?component';

import ChevronLeftGradient1Icon from '@/assets/icons/chevron-left-gradient-1.svg?skipsvgo';
import ChevronLeftGradient2Icon from '@/assets/icons/chevron-left-gradient-2.svg?skipsvgo';
import ChevronLeftGradient3Icon from '@/assets/icons/chevron-left-gradient-3.svg?skipsvgo';
import ChevronRightGradient1Icon from '@/assets/icons/chevron-right-gradient-1.svg?skipsvgo';
import ChevronRightGradient2Icon from '@/assets/icons/chevron-right-gradient-2.svg?skipsvgo';
import ChevronRightGradient3Icon from '@/assets/icons/chevron-right-gradient-3.svg?skipsvgo';
import CarouselGlow from '@/assets/images/carousel/carousel-glow.webp?url';

import {
  COLOR_SCHEME, TColorScheme,
} from '@/types/color-scheme';

import {
  TCarouselType,
} from './carousel';

import {
  ICarouselItem,
} from '@/types/fields/carousel';

const CARD_WIDTH_DESKTOP = 548;
const CARD_WIDTH_MOBILE = 326;
const CARD_MARGIN = 40;
const MOBILE_BREAKPOINT = 640;
const DEBOUNCE_TIMEOUT = 300;

interface IProps {
  type: TCarouselType;
  color: TColorScheme;
  title: string;
  subtitle: string;
  slideList: ICarouselItem[];
  buttonText: string;
  accentWord: string;
}

enum EDirection {
  LEFT = 'left',
  RIGHT = 'right',
}

const props = defineProps<IProps>();

// eslint-disable-next-line func-call-spacing, no-spaced-func
const emits = defineEmits<{
  (e: 'buttonClick'): void;
}>();

const isReady = ref(false);
const containerElementRef = ref<null | HTMLElement>(null);
const innerElementRef = ref<null | HTMLElement>(null);
const isTransitioning = ref(false);
const slidesPosition = ref(0);
const slideElements = ref<null | HTMLCollection>(null);
const slidesLength = ref(0);
const currentSlideIndex = ref(0);

const {
  width: containerWidth,
} = useElementSize(containerElementRef);

const {
  width: windowWidth,
} = useWindowSize();

const prevIconComputed = computed(() => {
  switch (props.color) {
    case COLOR_SCHEME.BLUE: {
      return ChevronLeftGradient1Icon;
    }
    case COLOR_SCHEME.VIOLET: {
      return ChevronLeftGradient2Icon;
    }
    case COLOR_SCHEME.ORANGE: {
      return ChevronLeftGradient3Icon;
    }
    default: {
      return ChevronLeftGradient1Icon;
    }
  }
});

const nextIconComputed = computed(() => {
  switch (props.color) {
    case COLOR_SCHEME.BLUE: {
      return ChevronRightGradient1Icon;
    }
    case COLOR_SCHEME.VIOLET: {
      return ChevronRightGradient2Icon;
    }
    case COLOR_SCHEME.ORANGE: {
      return ChevronRightGradient3Icon;
    }
    default: {
      return ChevronRightGradient1Icon;
    }
  }
});

const slideWidth = computed(() => {
  return windowWidth.value > MOBILE_BREAKPOINT ? CARD_WIDTH_DESKTOP : CARD_WIDTH_MOBILE;
});

const slideWithMargin = slideWidth.value + CARD_MARGIN;

function translate(direction: EDirection, shift: number) {
  return direction === EDirection.LEFT
    ? `translateX(${(slidesPosition.value - slideWidth.value - CARD_MARGIN) * shift}px)`
    : `translateX(${slidesPosition.value + slideWithMargin * shift}px)`;
}

function shiftSlide(direction: EDirection, shift: number) {
  isTransitioning.value = true;

  if (direction === EDirection.LEFT) {
    innerElementRef.value!.style.transform = translate(EDirection.LEFT, shift);
    currentSlideIndex.value += 1 * shift;
    slidesPosition.value -= slideWithMargin;
  }
  if (direction === EDirection.RIGHT) {
    innerElementRef.value!.style.transform = translate(EDirection.RIGHT, shift);
    currentSlideIndex.value -= 1 * shift;
    slidesPosition.value += slideWithMargin;
  }
}

function afterTransition(callback: () => void) {
  const listener = () => {
    callback();
    innerElementRef.value!.removeEventListener('transitionend', listener);
  };
  innerElementRef.value!.addEventListener('transitionend', listener);
}

function setOffset() {
  const containerFullWidth = containerElementRef.value!.clientWidth;
  const offset = Math.floor(containerFullWidth / 2)
    - (slideWidth.value / 2 + CARD_MARGIN * 2)
    - slideWidth.value * 2;
  innerElementRef.value!.style.left = `${offset}px`;
}

function resetCarousel() {
  isTransitioning.value = false;

  if (currentSlideIndex.value === -1) {
    innerElementRef.value!.style.transform = `translateX(${-(
      (slidesLength.value - 1)
      * slideWithMargin
    )}px)`;
    currentSlideIndex.value = slidesLength.value - 1;
    slidesPosition.value = -(slidesLength.value - 1) * slideWithMargin;
  }
  if (currentSlideIndex.value === slidesLength.value) {
    innerElementRef.value!.style.transform = 'translateX(0px)';
    currentSlideIndex.value = 0;
    slidesPosition.value = 0;
  }
}

function initCarousel() {
  slideElements.value = innerElementRef.value!.children;
  slidesLength.value = props.slideList.length;
  const firstSlide = slideElements.value[0];
  const secondSlide = slideElements.value[1];
  const beforeLastSlide = slideElements.value[slidesLength.value - 2];
  const lastSlide = slideElements.value[slidesLength.value - 1];
  const cloneFirst = firstSlide.cloneNode(true);
  const cloneSecond = secondSlide.cloneNode(true);
  const cloneLast = lastSlide.cloneNode(true);
  const cloneBeforeLast = beforeLastSlide.cloneNode(true);
  innerElementRef.value!.appendChild(cloneFirst);
  innerElementRef.value!.appendChild(cloneSecond);
  innerElementRef.value!.insertBefore(cloneBeforeLast, firstSlide);
  innerElementRef.value!.insertBefore(cloneLast, firstSlide);
  setOffset();
  isReady.value = true;
}

function prev() {
  if (isTransitioning.value) {
    return;
  }
  shiftSlide(EDirection.RIGHT, 1);
  afterTransition(() => {
    resetCarousel();
  });
}

function next() {
  if (isTransitioning.value) {
    return;
  }
  shiftSlide(EDirection.LEFT, 1);
  afterTransition(() => {
    resetCarousel();
  });
}

const {
  direction,
} = useSwipe(innerElementRef, {
  passive: true,
  onSwipe() {
    if (direction.value === EDirection.LEFT) {
      next();
    }
    if (direction.value === EDirection.RIGHT) {
      prev();
    }
  },
});

function navigateToCard(selectedSlideIndex: number) {
  if (isTransitioning.value || selectedSlideIndex === currentSlideIndex.value) {
    return;
  }
  isTransitioning.value = true;

  if (selectedSlideIndex > currentSlideIndex.value) {
    const shift = selectedSlideIndex - currentSlideIndex.value;
    innerElementRef.value!.style.transform = translate(EDirection.LEFT, shift);
    currentSlideIndex.value += 1 * shift;
    slidesPosition.value -= slideWithMargin * shift;
  } else {
    const shift = currentSlideIndex.value - selectedSlideIndex;
    innerElementRef.value!.style.transform = translate(EDirection.RIGHT, shift);
    currentSlideIndex.value -= 1 * shift;
    slidesPosition.value += slideWithMargin * shift;
  }
  afterTransition(() => {
    isTransitioning.value = false;
  });
}

function onButtonClick() {
  emits('buttonClick');
}

watch(
  containerWidth,
  useDebounceFn(() => {
    setOffset();
  }, DEBOUNCE_TIMEOUT),
);

onMounted(() => {
  initCarousel();
});
</script>
