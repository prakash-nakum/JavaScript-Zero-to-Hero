const els = {
  tableBody: document.getElementById("tableBody"),
  skeletonLoaders: document.getElementById("skeleton_loaders"),

  editModalEl: document.getElementById("edit_modal"),
  deleteModalEl: document.getElementById("delete_modal"),
  deleteUserName: document.getElementById("delete-user-name"),

  editId: document.getElementById("edit_id"),
  editName: document.getElementById("edit_name"),
  editUrl: document.getElementById("edit_url"),
  editFunnel: document.getElementById("edit_funnel"),
  editEmail: document.getElementById("edit_email"),
  editPassword: document.getElementById("edit_password"),
  editconfirpassword: document.getElementById("edit_confirpassword"),

  editUserWrap: document.getElementById("edit_membersWrap"),
  editAddRowBtn: document.getElementById("edit_add_row"),
  removeRowBtn: document.getElementById("removeRow"),

  entriesSelect: document.getElementById("entriesSelect"),
  pagination: document.getElementById("pagination"),
  showPagination: document.getElementById("show-pagination"),
  searchInput: document.getElementById("table-search"),
};

const deleteModal = new Modal(els.deleteModalEl);
const editModal = new Modal(els.editModalEl);

const state = {
  users: [],
  deleteId: null,
  editId: null,
  sort: "name",
  order: "asc",
};

const SORT_TYPE = {
  NAME: "name",
  URL: "url",
  FUNNEL: "funnel",
  EMAIL: "email",
};

function getParamsFromURL() {
  const p = new URLSearchParams(window.location.search);
  return {
    name: p.get("name") || "",
    page: Number(p.get("page")) || 1,
    entries: Number(p.get("entries")) || 10,
    sort: p.get("sort") || "name",
    order: p.get("order") || "asc",
  };
}

function updateURLParams(params) {
  const url = new URL(window.location);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== "" && v !== null && v !== undefined) {
      url.searchParams.set(k, v);
    } else {
      url.searchParams.delete(k);
    }
  });
  history.replaceState({}, "", url);
}

const api = {
  async filterUser({ name = "", page = 1, entries = 10, sort, order }) {
    const params = new URLSearchParams({
      name,
      page,
      entries,
      sort,
      order,
    });

    const res = await fetch(
      `../apis/pagination/sort_pagination_user.php?${params}`,
    );
    return res.json();
  },

  async deleteUser(id) {
    const res = await fetch(`../apis/user/delete_user.php?id=${id}`, {
      method: "DELETE",
    });
    return res.json();
  },

  async updateUser(id, payload) {
    const res = await fetch(`../apis/user/edit_user.php?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};

function renderTable(users) {
  els.tableBody.innerHTML = "";

  if (users.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="h-10 flex items-center justify-between">User Not found</td>`;
    els.tableBody.appendChild(tr);
  }

  state.users = users;
  users.forEach((row) => {
    let mpText = "";
    try {
      const arr = JSON.parse(row.user);

      mpText = arr.map((u) => `M:${u.members}, P:${u.percentage}`).join("<br>");
    } catch {
      mpText = row.user;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class=""  >${row.name}</td>
      <td class="" >${row.url}</td>
      <td class="" >${row.funnel}</td>
      <td class="" >${row.email}</td>
      <td class="" >${mpText}</td>
      <td>
        <button data-action="edit" data-id="${row.user_id}"><i class="material-icons text-blue-600">edit</i></button>
        <button data-action="delete" data-id="${row.user_id}"><i class="material-icons text-red-600">delete</i></button>
      </td>
    `;
    els.tableBody.appendChild(tr);
  });
}

function createEditRow(member, percentage) {
  const row = document.createElement("div");
  row.className = "member-row grid grid-cols-12 gap-3 items-end";
  row.innerHTML = `
    <div class="col-span-5">
      <label>Number Of Members</label>
      <input type="number" class="edit-members border p-2 w-full" value="${member}">
       <span class="error text-red-600"></span>
    </div>

    <div class="col-span-5">
      <label>Percentage</label>
      <input type="number" class="edit-percentage border p-2 w-full" value="${percentage}">
       <span class="error text-red-600"></span>
    </div>

    <div class="col-span-2">
      <button id="removeRow" type="button" class="remove-row bg-red-500 text-white px-3 py-2 rounded">-</button>
    </div>
  `;

  return row;
}

function openEditModal(id) {
  const user = state.users.find((u) => u.user_id === id);

  if (!user) return;

  state.editId = id;

  els.editId.value = user.id;
  els.editName.value = user.name;
  els.editUrl.value = user.url;
  els.editFunnel.value = user.funnel;
  els.editEmail.value = user.email;
  els.editPassword.value = user.password;
  els.editconfirpassword.value = user.confirmpassword;

  els.editUserWrap.innerHTML = "";

  let rows = [];
  rows = JSON.parse(user.user);
  if (rows.length) {
    rows.forEach((r) => {
      els.editUserWrap.appendChild(createEditRow(r.members, r.percentage));
    });
  }
  editModal.show();
}

function closeEditModal() {
  editModal.hide();
}
function closeDeleteModal() {
  deleteModal.hide();
}

function collectEditUsersData() {
  const arr = [];
  let isValid = true;

  els.editUserWrap.querySelectorAll(".member-row").forEach((row) => {
    const memberInput = row.querySelector(".edit-members");
    const percentInput = row.querySelector(".edit-percentage");

    const memberError = memberInput.nextElementSibling;
    const percentError = percentInput.nextElementSibling;

    memberError.textContent = "";
    percentError.textContent = "";

    if (!memberInput.value) {
      memberError.textContent = "This field is required";
      isValid = false;
    }

    if (!percentInput.value) {
      percentError.textContent = "This field is required";
      isValid = false;
    }

    arr.push({
      members: row.querySelector(".edit-members").value,
      percentage: row.querySelector(".edit-percentage").value,
    });
  });

  if (!isValid) return null;

  return arr;
}

async function editUserSubmit() {
  const users = collectEditUsersData();

  if (!users || users === null || users.length === 0) {
    return;
  }

  const payload = {
    name: els.editName.value,
    url: els.editUrl.value,
    funnel: els.editFunnel.value,
    email: els.editEmail.value,
    password: els.editPassword.value,
    confirmpassword: els.editconfirpassword.value,
    user: JSON.stringify(users),
  };

  const res = await api.updateUser(state.editId, payload);

  showToast(res.message, res.success);
  if (res.success) {
    const url = getParamsFromURL();
    editModal.hide();
    loadUsersByParams(url);
  }
}

els.editAddRowBtn.onclick = () => {
  els.editUserWrap.appendChild(createEditRow());
};

els.editUserWrap.addEventListener("click", (e) => {
  if (!e.target.classList.contains("remove-row")) return;

  if (els.editUserWrap.children.length === 1) {
    els.editUserWrap.disabled = true;
    els.editUserWrap.add("cursor-not-allowed");
    return;
  }

  e.target.closest(".member-row").remove();
});

function openDeleteModal(id) {
  state.deleteId = id;
  deleteModal.show();
}

async function handledeleteUser() {
  const res = await api.deleteUser(state.deleteId);
  showToast(res.message, res.success);
  deleteModal.hide();
  const url = getParamsFromURL();
  loadUsersByParams(url);
}

els.tableBody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;

  if (btn.dataset.action === "edit") openEditModal(id);
  if (btn.dataset.action === "delete") openDeleteModal(id);
});

async function loadUsersByParams(params) {
  const res = await api.filterUser(params);
  if (res.success) {
    renderTable(res.data);
    renderPagination(res.pagination_data);
  }
}

function searchUserByName(name) {
  applyParams({
    name,
    page: 1,
    entries: els.entriesSelect.value || 10,
  });
}

async function changePage(page) {
  applyParams({
    page,
  });
}

function handleEntries(entrie) {
  applyParams({
    entries: entrie.value,
    page: 1,
  });
}

function renderPagination(meta) {
  const url = getParamsFromURL();
  let buttonClass = "px-3 py-1 border rounded text-sm";
  const prevButton = document.createElement("button");
  const nextButton = document.createElement("button");
  prevButton.innerText = "Prev";
  nextButton.innerText = "Next";

  prevButton.classList = buttonClass;
  nextButton.classList = buttonClass;

  total_pages = meta.total_pages ? meta.total_pages : 1;
  current_page = meta.current_page ? meta.current_page : 1;
  total_results = meta.total_results ? meta.total_results : 0;

  if (total_pages === 1 || current_page === 1 || total_results === 0) {
    prevButton.disabled = true;
    prevButton.classList.add("cursor-not-allowed");
  }
  if (total_pages === current_page || total_results === 0) {
    nextButton.disabled = true;
    nextButton.classList.add("cursor-not-allowed");
  }

  prevButton.onclick = () => {
    changePage(url.page - 1);
  };

  nextButton.onclick = () => {
    changePage(url.page + 1);
  };

  els.pagination.innerHTML = "";
  els.pagination.appendChild(prevButton);

  if (current_page > 2) {
    const b = document.createElement("button");
    b.className = "px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100";
    b.textContent = 1;
    b.onclick = () => changePage(1);
    els.pagination.appendChild(b);
  }

  if (current_page > 3) {
    const b = document.createElement("span");
    b.textContent = "...";
    els.pagination.appendChild(b);
  }

  for (let i = current_page - 1; i <= current_page + 1; i++) {
    const b = document.createElement("button");
    b.textContent = i;

    if (i > 0 && i <= total_pages) {
      b.className =
        "px-3 py-1 border rounded text-sm " +
        (i === current_page
          ? "bg-blue-600 text-white"
          : "bg-white hover:bg-gray-100");

      b.onclick = () => changePage(i);

      els.pagination.appendChild(b);
    }
  }

  if (current_page < total_pages - 1) {
    const b = document.createElement("span");
    b.textContent = "...";
    els.pagination.appendChild(b);
  }

  if (current_page < total_pages - 1) {
    const b = document.createElement("button");
    b.className = "px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100";
    b.textContent = total_pages;
    b.onclick = () => changePage(total_pages);
    els.pagination.appendChild(b);
  }

  els.pagination.appendChild(nextButton);

  const from = (meta?.current_page - 1) * meta?.per_page + 1;
  const to = Math.min(meta?.current_page * meta?.per_page, meta?.total_results);
  if (total_results !== 0) {
    els.showPagination.innerText = `Showing ${from} to ${to} of ${meta?.total_results}`;
  } else {
    els.showPagination.innerText = "";
    prevButton.remove();
    nextButton.remove();
  }
}

function applyParams(changes = {}) {
  const params = {
    ...getParamsFromURL(),
    ...changes,
  };

  if (changes.sort) state.sort = changes.sort;
  if (changes.order) state.order = changes.order;
  updateURLParams(params);
  loadUsersByParams(params);
}

function sortBy(field) {
  const order = state.order === "asc" ? "desc" : "asc";
  applyParams({
    sort: field,
    order: order,
    page: 1,
  });
}

function sortUserData(type) {
  switch (type) {
    case SORT_TYPE.NAME:
      sortBy("name");
      break;

    case SORT_TYPE.URL:
      sortBy("url");
      break;

    case SORT_TYPE.FUNNEL:
      sortBy("funnel");
      break;

    case SORT_TYPE.EMAIL:
      sortBy("email");
      break;
    default:
      sortBy("name");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const params = getParamsFromURL();
  els.searchInput.value = params.name;
  els.entriesSelect.value = params.entries;
  loadUsersByParams(params);
});
