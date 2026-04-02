import React from 'react'


const Feedback = (props) => (
  <div
    className="col-lg-8 mr-auto ml-auto my-5"
    style={{
      minHeight: 'calc(100vh - 250px)', // adjust 100px to allow for navbar/footer
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <iframe
      src="https://forms.monday.com/forms/embed/afd004c9495060caf0f1313de599b563?r=use1"
      style={{
        flex: 1,
        border: 0,
        width: '100%',
        boxShadow: '5px 5px 56px 0px rgba(0,0,0,0.25)',
      }}
      title="Feedback Form"
    />
  </div>
);

export default Feedback;
