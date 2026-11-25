/* MRR site — "Send us a message" popup (Fred, 2026-11-25).
   Loaded from the footer on every page (inside <footer>, so Builder's
   features.html generator copies it along with the footer).
   Opens from any link marked data-mrr-contact, and on arrival at #contact.
   Sent by Web3Forms to Fred's support inbox; the address never appears on
   the page. The hidden "botcheck" box is a spam trap. */
(function(){
  var KEY = '350914e3-321c-4b73-995c-2cc020a971d1';
  var ov, form, st, btn, lastFocus;

  function build(){
    ov = document.createElement('div');
    ov.className = 'mrr-cf-ov';
    ov.hidden = true;
    ov.innerHTML =
      '<div class="mrr-cf" role="dialog" aria-modal="true" aria-labelledby="mrr-cf-h">' +
        '<button type="button" class="mrr-cf-x" aria-label="Close">&times;</button>' +
        '<h2 id="mrr-cf-h">Send us a message</h2>' +
        '<p>Have a question or found a problem? We&rsquo;ll reply to the email you give.</p>' +
        '<form novalidate>' +
          '<input type="hidden" name="access_key" value="' + KEY + '">' +
          '<input type="hidden" name="from_name" value="MRR website">' +
          '<input type="checkbox" name="botcheck" class="mrr-trap" tabindex="-1" autocomplete="off">' +
          '<label for="mrr-cf-name">Name</label>' +
          '<input id="mrr-cf-name" name="name" type="text" required autocomplete="name">' +
          '<label for="mrr-cf-email">Your email</label>' +
          '<input id="mrr-cf-email" name="email" type="email" required autocomplete="email">' +
          '<label for="mrr-cf-msg">Message</label>' +
          '<textarea id="mrr-cf-msg" name="message" rows="6" required></textarea>' +
          '<button type="submit" class="mrr-cf-send">Send</button>' +
          '<p class="mrr-cf-status" role="status"></p>' +
        '</form>' +
      '</div>';
    document.body.appendChild(ov);
    form = ov.querySelector('form');
    st = ov.querySelector('.mrr-cf-status');
    btn = ov.querySelector('.mrr-cf-send');
    ov.querySelector('.mrr-cf-x').addEventListener('click', close);
    ov.addEventListener('click', function(e){ if (e.target === ov) close(); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !ov.hidden) close(); });
    form.addEventListener('submit', send);
  }

  function open(){
    if (!ov) build();
    lastFocus = document.activeElement;
    st.textContent = '';
    ov.hidden = false;
    document.body.classList.add('mrr-cf-lock');
    setTimeout(function(){ document.getElementById('mrr-cf-name').focus(); }, 0);
  }
  function close(){
    ov.hidden = true;
    document.body.classList.remove('mrr-cf-lock');
    if (location.hash === '#contact') history.replaceState(null, '', location.pathname + location.search);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function send(e){
    e.preventDefault();
    if (!form.checkValidity()) { st.textContent = 'Please fill in your name, your email and a message.'; return; }
    var d = new FormData(form);
    d.append('subject', 'MRR website: message from ' + d.get('name'));
    btn.disabled = true; st.textContent = 'Sending…';
    fetch('https://api.web3forms.com/submit', { method: 'POST', body: d })
      .then(function(r){ return r.json(); })
      .then(function(j){
        if (j.success) { form.reset(); st.textContent = 'Thanks — we got your message and will reply by email.'; }
        else { st.textContent = 'Sorry, that didn’t send. Please try again in a minute.'; }
      })
      .catch(function(){ st.textContent = 'Sorry, that didn’t send. Check your connection and try again.'; })
      .then(function(){ btn.disabled = false; });
  }

  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('[data-mrr-contact]');
    if (!a) return;
    e.preventDefault();
    open();
  });
  if (location.hash === '#contact') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', open); else open();
  }
})();
