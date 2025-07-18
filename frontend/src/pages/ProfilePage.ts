import { i18n } from "../services/i18n.js";
import { createLanguageSwitcher } from "../components/LanguageSwitcher.js";
// import { TwoFactorSettings } from "../components/TwoFactorSettings.js";

export function createProfilePage(): HTMLElement {
	const page = document.createElement("div");
	page.className = "page-container fade-in flex flex-col items-center gap-6";

	const renderContent = () => {
		page.innerHTML = `
			<div class="absolute top-4 right-4" id="language-switcher-container"></div>

			<!-- Conteneur principal avec disposition côte à côte - centré -->
			<div class="flex gap-10 items-start" style="height: 80vh; max-width: 1300px; width: 95%;">
				<!-- Colonne de gauche : Profile + Friends - largeur fixe (moitié du match history) -->
				<div class="flex flex-col gap-6 h-full" style="width: 600px;">
					<!-- Bloc Profile Principal -->
					<div class="card w-full flex flex-col items-center slide-up flex-shrink-0">
						<header class="nav-header w-full">
							<button class="btn-ghost" data-route="/home">${i18n.t('profile.back')}</button>
							<h2 class="page-title">${i18n.t('profile.my_profile')}</h2>
						</header>
						<main class="w-full flex flex-col items-center">
							<div class="flex items-center gap-8 mb-8">
								<div class="avatar-container">
									<img src="/default-avatar.png" id="user-avatar" class="w-full h-full object-cover">
									<button id="edit-avatar" title="${i18n.t('profile.edit_avatar')}" class="edit-avatar-btn"
										style="
											background:none;
											border:none;
											position:absolute;
											top:50%;
											left:50%;
											transform:translate(-50%,-50%);
											cursor:pointer;
											z-index:10;
											border-radius:50%;
											padding:8px;
											display:flex;
											align-items:center;
											justify-content:center;
											transition: opacity 0.2s;
										">
										<img src="../assets/edit.svg" alt="Edit" style="width:20px; height:20px;">
									</button>
									<input type="file" id="avatar-file-input" accept="image/png, image/jpeg" style="display:none;" />
								</div>
								<div class="flex-1">
									<div class="flex items-center gap-3 mb-3">
										<h3 id="username" class="section-title mb-0">Username</h3>
										<button id="edit-username" title="${i18n.t('profile.edit_username')}" class="btn-ghost btn-small">
											<img src="../assets/edit.svg" alt="Edit" style="width:16px; height:16px;">
										</button>
									</div>
									<div class="flex items-center gap-3 mb-3">
										<span id="password" class="text-muted">${i18n.t('profile.password_display')}</span>
										<button id="edit-password" title="${i18n.t('profile.edit_password')}" class="btn-ghost btn-small">
											<img src="../assets/edit.svg" alt="Edit" style="width:16px; height:16px;">
										</button>
									</div>
									<div class="bg-surface p-4 rounded-modern border">
										<p id="user-stats" class="text-muted text-sm">${i18n.t('profile.games_played_stats', {games: '0', wins: '0', losses: '0'})}</p>
									</div>
								</div>
							</div>
							
							<!-- Security Section -->
							<div class="w-full mb-4">
								<h4 class="text-lg font-semibold mb-3">${i18n.t('profile.security') || 'Security'}</h4>
								<div class="space-y-2">
									<button id="manage-2fa" class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm">
										🔐 ${i18n.t('profile.manage_2fa') || 'Manage Two-Factor Authentication'}
									</button>
								</div>
							</div>
						</main>
					</div>

					<!-- Bloc Friends List - occupe le reste de l'espace -->
					<div id="friends-block" class="card w-full flex flex-col slide-up flex-1">
						<header class="nav-header w-full flex-shrink-0">
							<h2 class="section-title mb-0">${i18n.t('profile.friends_list')}</h2>
						</header>
						<main class="w-full flex-1 overflow-y-auto p-4">
							<!-- Le contenu de la liste d'amis sera ajouté ici -->
							<!-- Plus d'amis peuvent être ajoutés ici -->
						</main>
					</div>
				</div>

				<!-- Colonne de droite : Match History - largeur fixe -->
				<div class="h-full" style="width: 800px;">
					<div id="match-block" class="card w-full flex flex-col h-full slide-up">
						<header class="nav-header w-full">
							<h2 class="section-title mb-0">${i18n.t('profile.match_history')}</h2>
						</header>
						<main class="w-full flex-1 overflow-y-auto">
							<!-- Le contenu de l'historique des matchs sera ajouté ici -->
						</main>
					</div>
				</div>
			</div>
		`;
	};

	renderContent();

	// Insérer le commutateur de langue
	const languageSwitcherContainer = page.querySelector('#language-switcher-container');
	if (languageSwitcherContainer) {
		languageSwitcherContainer.appendChild(createLanguageSwitcher());
	}

	// Re-render when language changes
	window.addEventListener('languageChanged', renderContent);
  	editAvatar(page);
	editUsername(page);
	editPassword(page);
	manage2FA(page);

	getUserInfo().then(data =>{
		if (data){
			const usernameElem = page.querySelector('#username') as HTMLElement;
			if (usernameElem) usernameElem.textContent = data.username;

			const avatarElem = page.querySelector('#user-avatar') as HTMLImageElement;
			console.log("Avatar URL reçue :", data.avatarUrl);
			if (avatarElem && data.avatarUrl) avatarElem.setAttribute('src', data.avatarUrl);

			const statElem = page.querySelector("#user-stats") as HTMLElement;
			console.log("gamesPlayed reçue :", data.gamesPlayed);
			console.log("wins reçue :", data.wins);
			console.log("losses reçue :", data.losses);
			if (statElem && data.gamesPlayed && data.wins &&  data.losses){
				statElem.textContent = i18n.t('profile.games_played_stats', {
					games: data.gamesPlayed.toString(),
					wins: data.wins.toString(),
					losses: data.losses.toString()
				});
			}
		}
	});

	displayMatchHistory(page);
	displayFriendsList(page);

	page.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;
		const route = target.getAttribute('data-route');
		if (route) {
			import('../router/router.js').then(({ router }) => {
				router.navigate(route);
		});
		}
	});

	return page;
}

async function getUserInfo() {
	try {
		const token = sessionStorage.getItem('authToken');
		if (!token) {
			throw new Error('No auth token found');
		}

		const response = await fetch('/api/me', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		});

		if (response.ok) {
			const userData = await response.json();
			console.log("User data retrieved:", userData);
			return userData;
		} else {
			console.error("Failed to get user info");
			import('../router/router.js').then(({ router }) => {
				router.navigate('/login');
			});
			return null;
		}
	} catch (error) {
		console.error("Error fetching user info:", error);
		return null;
	}
}

//ADD EDIT USERNAME FUNCTION
async function editUsername(page: HTMLDivElement){
	const token = sessionStorage.getItem('authToken');
	if (!token) {
		throw new Error('No auth token found');
	}
	const usernameElem = page.querySelector("#username") as HTMLElement;
	const editUsernameBtn = page.querySelector("#edit-username") as HTMLButtonElement;

	if (usernameElem && editUsernameBtn){
		editUsernameBtn.addEventListener("click", () => {
			enableInlineEdit({
				element: usernameElem,
				initialValue: usernameElem.textContent || "",
				inputType: "string",
				onValidate: async (newValue) => {
					const UserInfo = {
							username: usernameElem.textContent,
							newUsername: newValue,
					};
					const response = await fetch('/api/profile/username', {
						method: "POST",
						headers:{
							"Content-Type": "application/json",
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify(UserInfo),
					});
					const data = await response.json();
					if (data.ok || data.success){
						console.log("Username succesfully edited!");
						sessionStorage.removeItem('username');
						sessionStorage.setItem('username', newValue);
						usernameElem.textContent = newValue;
					} else {
						alert(i18n.t('profile.username_error'));
					}
				}
			});
		});
	}
}

async function editPassword(page: HTMLDivElement){
	const token = sessionStorage.getItem('authToken');
	if (!token) {
		throw new Error('No auth token found');
	}
	const passwordElem = page.querySelector('#password') as HTMLElement;
	const editPasswordBtn = page.querySelector('#edit-password') as HTMLButtonElement;
	if (passwordElem && editPasswordBtn) {
		editPasswordBtn.addEventListener("click", () => {
			enableInlineEdit({
				element: passwordElem,
				initialValue: "",
				inputType: "password",
				onValidate: async (newValue) => {
					const UserInfo = {
							username: sessionStorage.getItem('username'),
							newPassword: newValue,
					};
					const response = await fetch('/api/profile/password', {
						method: "POST",
						headers:{
							"Content-Type": "application/json",
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify(UserInfo),
					});
					const data = await response.json();
					if (data.ok || data.success){
						console.log("Password succesfully edited!");
					} else {
						alert(i18n.t('profile.password_error'));
					}
					passwordElem.textContent = i18n.t('profile.password_display');
				}
			});
		});
	}
}

function enableInlineEdit({element, initialValue, onValidate, inputType = "text"} :
	{
		element: HTMLElement,
		initialValue: string,
		onValidate: (newValue: string) => Promise<void> | void,
		inputType?: string,
	}) {
		const input = document.createElement("input");
		input.type = inputType;
		input.value = initialValue;
		input.className = "input";
		input.style.marginRight = "8px";
		input.style.width = "auto";
		input.style.display = "inline-block";

		const validateBtn = document.createElement("button");
		validateBtn.textContent = i18n.t('profile.validate');
		validateBtn.className = "btn";
		validateBtn.type = "button";

		const cancelBtn = document.createElement("button");
		cancelBtn.textContent = i18n.t('profile.cancel');
		cancelBtn.className = "btn";
		cancelBtn.type = "button";
		cancelBtn.style.marginLeft = "8px";

		const parent = element.parentElement;
		const oldContent = element.cloneNode(true);

		parent?.replaceChild(input, element);
		parent?.appendChild(validateBtn);
		parent?.appendChild(cancelBtn);

		const cleanup = () => {
			parent?.replaceChild(oldContent, input);
			validateBtn.remove();
			cancelBtn.remove();
		};

		validateBtn.onclick = async () => {
			await onValidate(input.value);
			cleanup();
		};
		cancelBtn.onclick = cleanup;

		input.focus();
		input.onkeydown = (e) => {
			if (e.key === "Escape") cleanup();
			if (e.key === "Enter") validateBtn.click();
		};
}

//CHANGE AVATAR FUNCTION
async function editAvatar(page: HTMLDivElement){
	const editAvatarBtn = page.querySelector("#edit-avatar") as HTMLButtonElement;
	const fileInput = page.querySelector("#avatar-file-input") as HTMLInputElement;
	const avatarImg = page.querySelector("#user-avatar") as HTMLImageElement;

	if (editAvatarBtn && fileInput && avatarImg){
		editAvatarBtn.addEventListener("click", (e) => {
			//e.preventDefault();
			fileInput.click();
		});
		fileInput.addEventListener("change", (e) => {
			const file = fileInput.files?.[0];
			console.log("file: ", file);
			if (file){
				const reader = new FileReader;
				reader.onload = async function(evt){
					if (evt.target && typeof evt.target.result === "string")
					{
						const avatarUrl = await updateDbAvatar(file);
						console.log('avatarUrl: ', avatarUrl);
						if (avatarUrl)
							avatarImg.src = avatarUrl;
					}
				}
				reader.readAsDataURL(file);
			}
		});
	}
}

async function updateDbAvatar(file: File){
	const token = sessionStorage.getItem('authToken');
	if (!token) {
		throw new Error('No auth token found');
	}
	const formData = new FormData;
	const username = sessionStorage.getItem("username");
	formData.append('avatar', file);
	formData.append('username', username || '');

	const response = await fetch('/api/profile/avatar', {
		method: 'POST',
		headers:{
			'Authorization': `Bearer ${token}`
		},
		body: formData,
	});
	if (response.ok){
		const data = await response.json();
		console.log('Avatar updated!', data);
		if (data.avatarPath && typeof data.avatarPath === 'string') {
/* 			// 🔍 Ajout d'un timestamp pour éviter le cache
			const timestampedUrl = `${data.avatarPath}?t=${Date.now()}`;
			console.log('URL avec timestamp:', timestampedUrl); */
			return data.avatarPath;
		} else {
			console.error('Failed to update avatar');
			return null;
		}
	}
	return null;
}


async function getMatchHistory() {
	try {
		const user = await getUserInfo();
		if (!user) return null;

		const token = sessionStorage.getItem('authToken');
		if (!token) {
			throw new Error('No auth token found');
		}

		const response = await fetch(`/api/profile/matches?username=${encodeURIComponent(user.username)}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
		});

		if (response.ok) {
			const matches = await response.json();
			console.log('Match history retrieved!', matches);
			return matches;
		} else {
			console.error('Failed to retrieve match history');
			return null;
		}
	} catch (error) {
		console.error('Error fetching match history:', error);
		return null;
	}
}

async function displayMatchHistory(page: HTMLDivElement)
{
	console.log("ENTER IN MATCH HISTORY");
	const username = sessionStorage.getItem("username");
	console.log("USERNAME RETRIEVED : ", username);
	const history = await getMatchHistory();
	console.log("HISTORY RETRIEVED : ", history);
	const histDiv = page.querySelector("#match-block");
	if (!histDiv) return;

	let html = `
		<table class="data-table">
			<thead>
				<tr>
					<th>${i18n.t('profile.date')}</th>
					<th>${i18n.t('profile.opponent')}</th>
					<th>${i18n.t('profile.result')}</th>
				</tr>
			</thead>
			<tbody>
	`;

	for (const match of history){
		const isPlayer1 = match.player1.username === username;
		const opponent = isPlayer1 ? match.player2.username : match.player1.username;
		const result = match.winnerId === (isPlayer1 ? match.player1Id : match.player2Id) ? i18n.t('profile.victory') : i18n.t('profile.defeat');
		const date = new Date(match.playedAt).toLocaleDateString();
		const statusClass = result === i18n.t('profile.victory') ? "status-victory" : "status-defeat";

	html += `
			<tr>
				<td>${date}</td>
				<td>${opponent}</td>
				<td><span class="${statusClass}">${result}</span></td>
			</tr>
		`;
	}
	html += `</tbody></table>`;
	histDiv.innerHTML = html;
}

async function getFriendsList() {
	try {
		const user = await getUserInfo();
		if (!user) return null;

		const token = sessionStorage.getItem('authToken');
		if (!token) {
			throw new Error('No auth token found');
		}

		const response = await fetch(`/api/profile/friends?username=${encodeURIComponent(user.username)}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
		});

		if (response.ok) {
			const friends = await response.json();
			console.log('Friends list retrieved!', friends);
			return friends;
		} else {
			console.error('Failed to retrieve friends list');
			return null;
		}
	} catch (error) {
		console.error('Error fetching friends list:', error);
		return null;
	}
}


async function displayFriendsList(page: HTMLDivElement)
{
	console.log("ENTER IN FRIENDS LIST");
	const username = sessionStorage.getItem("username");
	console.log("USERNAME RETRIEVED : ", username);
	const friendsList = await getFriendsList();
	if (!friendsList) return ;
	console.log("FRIENDS LIST RETRIEVED : ", friendsList);
	const friendsDiv = page.querySelector("#friends-block");
	if (!friendsDiv) return;

	let html = `
		<table class="data-table">
			<thead>
				<tr>
					<th>${i18n.t('id')}</th>
					<th>${i18n.t('avatar')}</th>
					<th>${i18n.t('name')}</th>
					<th>${i18n.t('Games_played')}</th>
				</tr>
			</thead>
			<tbody>
	`;

	for (const friend of friendsList){
		const avatar = friend.getItem("avatarUrl")
		const id = friend.getItem("id");
		const name = friend.getItem("username");
		const played = friend.getItem("gamesPlayed");

	html += `
			<tr>
				<td>${id}</td>
				<td>${avatar}</td>
				<td>${name}</td>
				<td>${played}</td>
			</tr>
		`;
	}
	html += `</tbody></table>`;
	friendsDiv.innerHTML = html;
}

function manage2FA(page: HTMLDivElement): void {
	const manage2FABtn = page.querySelector('#manage-2fa') as HTMLButtonElement;
	
	manage2FABtn?.addEventListener('click', () => {
		// Create modal overlay
		const modalOverlay = document.createElement('div');
		modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
		modalOverlay.innerHTML = `
			<div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
				<div class="flex justify-between items-center p-4 border-b">
					<h3 class="text-xl font-semibold">Security Settings</h3>
					<button id="close-2fa-modal" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
				</div>
				<div id="2fa-settings-container" class="p-4"></div>
			</div>
		`;

		document.body.appendChild(modalOverlay);

		// Initialize 2FA settings
		const settingsContainer = modalOverlay.querySelector('#2fa-settings-container') as HTMLElement;
		const twoFactorSettings = new TwoFactorSettings(settingsContainer);
		twoFactorSettings.init();

		// Close modal handlers
		const closeBtn = modalOverlay.querySelector('#close-2fa-modal') as HTMLButtonElement;
		const closeModal = () => {
			document.body.removeChild(modalOverlay);
		};

		closeBtn.addEventListener('click', closeModal);
		modalOverlay.addEventListener('click', (e) => {
			if (e.target === modalOverlay) {
				closeModal();
			}
		});
	});
}