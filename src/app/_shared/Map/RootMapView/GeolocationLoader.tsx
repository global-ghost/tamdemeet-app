export const GeolocationLoader = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <svg
        viewBox='0 0 700 400'
        className='size-40 sm:size-60 md:size-80'
        xmlns='http://www.w3.org/2000/svg'
      >
        <desc>
          A short loading animation picturing a geolocation icon hopping over a
          loading bar-ball
        </desc>
        <defs>
          <g id='svg-geo'>
            <g id='svg-geo-triangle'>
              <path d='m 220 100 l 80 200 l 80 -200 l 100 0 z' fill='#173A2B' />
            </g>

            <g id='svg-geo-circle'>
              <circle cx='300' cy='83' r='81' fill='#173A2B' />
              <circle cx='300' cy='83' r='60' fill='#d6e9ff' />
              <circle cx='300' cy='83' r='30' fill='#173A2B' />
            </g>
          </g>
        </defs>

        <g transform='translate(0, 50)'>
          <path
            d='m 0 0 l 0 -120 z'
            id='jump'
            stroke='transparent'
            strokeWidth='7'
          />

          <use href='#svg-geo'>
            <animateMotion
              dur='1.5s'
              repeatCount='indefinite'
              fill='remove'
              calcMode='linear'
            >
              <mpath href='#jump' />
            </animateMotion>
          </use>
        </g>
      </svg>
    </div>
  );
};
