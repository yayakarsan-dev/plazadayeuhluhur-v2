   <script>
        /* ==========================================
           ASSETS / JS / UNDANGAN.JS
           ========================================== */

        // Dynamic Event Database Mock Data
        const hajatanDatabase = {
            "1": {
                title: "Andi & Siti",
                badge: "Undangan Pernikahan",
                quote: `"Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk berkenan hadir dalam acara pernikahan kami."`,
                subLocation: "Panulisan, Dayeuhluhur",
                subDate: "Minggu, 30 Agustus 2026",
                fullDate: "Minggu, 30 Agustus 2026",
                time: "Pukul 10.00 WIB - Selesai",
                locationName: "Dusun Sukamaju",
                address: "Desa Panulisan, Kecamatan Dayeuhluhur, Kab. Cilacap",
                entertainment: "Organ Tunggal \"Nada Melati Panulisan\"",
                targetDate: new Date("2026-08-30T10:00:00").getTime(),
                photo: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80"
            },
            "2": {
                title: "Khitanan Raihan",
                badge: "Syukuran Khitanan",
                quote: `"Dengan mengucap syukur kepada Allah SWT, kami mengharapkan kehadiran Bapak/Ibu/Saudara/i pada acara Syukuran Khitanan putra kami Raihan."`,
                subLocation: "Matenggeng, Dayeuhluhur",
                subDate: "Sabtu, 05 September 2026",
                fullDate: "Sabtu, 05 September 2026",
                time: "Pukul 09.00 WIB - Selesai",
                locationName: "Dusun Cikumpay",
                address: "Desa Matenggeng, Kecamatan Dayeuhluhur, Kab. Cilacap",
                entertainment: "Seni Calung & Marawis Warga",
                targetDate: new Date("2026-09-05T09:00:00").getTime(),
                photo: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80"
            },
            "3": {
                title: "Walimatul Bpk. Ahmad",
                badge: "Syukuran Rumah Baru",
                quote: `"Atas berkat rahmat Allah SWT, kami mengundang bapak/ibu tetangga dan kerabat untuk bersama-sama mendoakan keselamatan rumah baru kami."`,
                subLocation: "Ciwalen, Dayeuhluhur",
                subDate: "Sabtu, 12 September 2026",
                fullDate: "Sabtu, 12 September 2026",
                time: "Pukul 19.30 WIB (Ba'da Isya)",
                locationName: "Dusun Ciwalen Tengah",
                address: "Desa Ciwalen, Kecamatan Dayeuhluhur, Kab. Cilacap",
                entertainment: "Pengajian & Hadroh Warga RT 02",
                targetDate: new Date("2026-09-12T19:30:00").getTime(),
                photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
            }
        };

        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Parse query parameter ?id=
        const urlParams = new URLSearchParams(window.location.search);
        let eventId = urlParams.get('id') || '1';

        // Load Event Data Function
        function loadEventData(id) {
            const data = hajatanDatabase[id] || hajatanDatabase['1'];
            
            document.getElementById('eventTitle').innerText = data.title;
            document.getElementById('breadcrumbCurrent').innerText = data.title;
            document.getElementById('eventQuote').innerText = data.quote;
            document.getElementById('eventSubLocation').innerText = data.subLocation;
            document.getElementById('eventSubDate').innerText = data.subDate;
            document.getElementById('eventFullDate').innerText = data.fullDate;
            document.getElementById('eventTime').innerHTML = `<i class="fa-regular fa-clock text-sky-600"></i> ${data.time}`;
            document.getElementById('eventLocationName').innerText = data.locationName;
            document.getElementById('eventAddress').innerText = data.address;
            document.getElementById('mapAddressModal').innerText = data.address;
            document.getElementById('eventEntertainment').innerText = data.entertainment;
            document.getElementById('eventPhoto').src = data.photo;
            document.getElementById('eventBadge').innerHTML = `<i class="fa-solid fa-ring text-xs"></i> ${data.badge}`;
            document.getElementById('externalMapBtn').href = `https://maps.google.com/?q=${encodeURIComponent(data.address)}`;

            // Highlight active event in sidebar switcher
            ['1', '2', '3'].forEach(num => {
                const el = document.getElementById(`eventItem-${num}`);
                if (el) {
                    if (num === id) {
                        el.className = "block p-3.5 rounded-2xl border-2 border-sky-500 bg-sky-50/50 hover:bg-sky-50 transition relative group";
                    } else {
                        el.className = "block p-3.5 rounded-2xl border border-slate-200 hover:border-sky-300 bg-white hover:bg-slate-50 transition relative group";
                    }
                }
            });

            startCountdown(data.targetDate);
        }

        let countdownInterval;
        function startCountdown(targetTime) {
            if (countdownInterval) clearInterval(countdownInterval);

            function updateTimer() {
                const now = new Date().getTime();
                const diff = targetTime - now;

                if (diff <= 0) {
                    document.getElementById('countdownContainer').innerHTML = '<div class="col-span-4 font-bold text-amber-400 py-2 text-sm">Acara sedang berlangsung / telah selesai</div>';
                    return;
                }

                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);

                document.getElementById('days').innerText = String(d).padStart(2, '0');
                document.getElementById('hours').innerText = String(h).padStart(2, '0');
                document.getElementById('minutes').innerText = String(m).padStart(2, '0');
                document.getElementById('seconds').innerText = String(s).padStart(2, '0');
            }

            updateTimer();
            countdownInterval = setInterval(updateTimer, 1000);
        }

        // RSVP Modal Functions
        function openRsvpModal() {
            document.getElementById('rsvpModal').classList.remove('hidden');
        }
        function closeRsvpModal() {
            document.getElementById('rsvpModal').classList.add('hidden');
        }

        function sendRsvpWhatsApp(e) {
            e.preventDefault();
            const name = document.getElementById('rsvpName').value;
            const status = document.getElementById('rsvpStatus').value;
            const guests = document.getElementById('rsvpGuests').value;
            const message = document.getElementById('rsvpMessage').value;
            const eventTitle = document.getElementById('eventTitle').innerText;

            const text = `Halo, Saya *${name}* ingin mengonfirmasi kehadiran untuk acara *${eventTitle}*:%0A- *Status:* ${status}%0A- *Jumlah Tamu:* ${guests} orang%0A- *Ucapan:* ${message || '-'}`;
            
            window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
            closeRsvpModal();
            openToast('Membuka WhatsApp untuk mengirim konfirmasi...');
        }

        // Map Modal Functions
        function openMapModal() {
            document.getElementById('mapModal').classList.remove('hidden');
        }
        function closeMapModal() {
            document.getElementById('mapModal').classList.add('hidden');
        }

        // Add to Google Calendar
        function addToCalendar() {
            const title = document.getElementById('eventTitle').innerText;
            const address = document.getElementById('eventAddress').innerText;
            const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&location=${encodeURIComponent(address)}&details=${encodeURIComponent('Undangan Hajatan Warga Plaza Dayeuhluhur')}`;
            window.open(googleCalUrl, '_blank');
        }

        // Share Link Function
        function shareInvitation() {
            const tempInput = document.createElement('input');
            tempInput.value = window.location.href;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            openToast('Link undangan berhasil disalin ke clipboard!');
        }

        // Toast Notification Helper
        function openToast(msg) {
            const toastBox = document.getElementById('toastBox');
            document.getElementById('toastMessage').innerText = msg;
            toastBox.classList.remove('hidden');
            toastBox.classList.add('flex');
            setTimeout(() => {
                toastBox.classList.add('hidden');
                toastBox.classList.remove('flex');
            }, 3500);
        }

        window.onload = function() {
            loadEventData(eventId);
        };
    </script>